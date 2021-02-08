import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import {
  requireAuth,
  validateRequest,
  RouteNotFoundError,
  NotAuthorizedError,
} from '@playedby/common'

import { Ticket } from '../models/ticket'

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

    res.status(200).send(ticket)
  }
)

export { router as updateTicketRouter }
