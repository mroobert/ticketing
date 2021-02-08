import express, { Request, Response } from 'express'
import { requireAuth, RouteNotFoundError } from '@playedby/common'

import { Ticket } from '../models/ticket'

const router = express.Router()

router.get('/api/tickets/:id', requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params
  const ticket = await Ticket.findById(id)
  if (!ticket) {
    throw new RouteNotFoundError()
  }
  res.status(200).send(ticket)
})

export { router as retrieveTicketRouter }
