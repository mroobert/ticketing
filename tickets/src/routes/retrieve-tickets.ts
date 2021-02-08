import express, { Request, Response } from 'express'
import { requireAuth } from '@playedby/common'

import { Ticket } from '../models/ticket'

const router = express.Router()

router.get('/api/tickets', requireAuth, async (req: Request, res: Response) => {
  const tickets = await Ticket.find({})
  res.status(200).send(tickets)
})

export { router as retrieveTicketsRouter }
