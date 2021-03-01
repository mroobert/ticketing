import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import {
  requireAuth,
  validateRequest,
  RouteNotFoundError,
  NotAuthorizedError,
} from '@playedby/common'

import { Ticket } from '../models/ticket'
import { natsWrapper } from '../nats-wrapper'
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher'

const router = express.Router()

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').trim().notEmpty().withMessage('Title is required.'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0.'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body
    const { id } = req.params
    const ticket = await Ticket.findById(id)

    if (!ticket) {
      throw new RouteNotFoundError()
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }

    ticket.set({
      title,
      price,
    })
    await ticket.save()
    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    })

    res.status(200).send(ticket)
  }
)

export { router as updateTicketRouter }
