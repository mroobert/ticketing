import express, { Request, Response } from 'express'
import { requireAuth, NotFoundError, NotAuthorizedError, OrderStatus } from '@playedby/common'

import { Order } from '../models'
import { natsWrapper } from '../nats-wrapper'
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher'

const router = express.Router()

router.patch('/api/orders/:id', requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params
  const order = await Order.findById(id).populate('ticket')
  if (!order) {
    throw new NotFoundError()
  }
  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError()
  }

  order.status = OrderStatus.Cancelled
  await order.save()

  await new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    ticket: {
      id: order.ticket.id,
    },
  })
  res.sendStatus(204)
})

export { router as cancelOrderRouter }
