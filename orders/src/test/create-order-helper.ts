import request from 'supertest'

import { app } from '../app'
import { Ticket } from '../models/ticket'
import { getAuthCookie } from './cookie-helper'

export async function createOrder(
  title: string,
  price: number,
  user: { id: string; email: string }
) {
  const ticket = Ticket.build({
    title,
    price,
  })
  await ticket.save()
  return await request(app)
    .post('/api/orders')
    .set('Cookie', getAuthCookie(user.id, user.email))
    .send({ ticketId: ticket.id })
    .expect(201)
}
