import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  BadRequestError,
  OrderStatus,
} from '@playedby/common'

import { Order, Ticket } from '../models'
import { natsWrapper } from '../nats-wrapper'
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher'

const router = express.Router()

router.post(
  '/api/orders',
  requireAuth,
  [body('ticketId').not().isEmpty().withMessage('You must provide a valid ticket id.')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body

    const ticket = await Ticket.findById(ticketId)
    if (!ticket) {
      throw new NotFoundError()
    }

    const isReserved = await ticket.isReserved()
    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved.')
    }

    const expiration = new Date()
    expiration.setSeconds(
      expiration.getSeconds() + parseInt(process.env.EXPIRATION_WINDOW_SECONDS!, 10)
    )

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    })
    await order.save()

    await new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    })

    res.status(201).send(order)
  }
)

export { router as createOrderRouter }
