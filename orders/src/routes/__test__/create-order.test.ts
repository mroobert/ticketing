import request from 'supertest'

import { app } from '../../app'
import { getAuthCookie } from '../../test/cookie-helper'
import { generateId } from '../../test/generate-id-helper'
import { Order, Ticket } from '../../models'
import { OrderStatus } from '@playedby/common'
import { natsWrapper } from '../../nats-wrapper'

it('has a route handler listening to /api/orders for POST request', async () => {
  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', getAuthCookie('id999', 'test@test.com'))
    .send({})
  expect(response.status).not.toEqual(404)
})

it('can only be accessed if the user is signed in', async () => {
  await request(app).post('/api/orders').send({}).expect(401)
})

it('returns 400 and error message if no ticket id is provided', async () => {
  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', getAuthCookie('id999', 'test@test.com'))
    .send({ ticketId: '' })
    .expect(400)

  expect(response.body.errors[0].message).toEqual('You must provide a valid ticket id.')
})

it('returns an error(400) if the ticket does not exist', async () => {
  const ticketId = generateId()
  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', getAuthCookie('id999', 'test@test.com'))
    .send({ ticketId })
    .expect(404)

  expect(response.body.errors[0].message).toEqual('Not found.')
})

it('returns an error(400) if the ticket is already reserved', async () => {
  const ticket = Ticket.build({
    title: 'Title value',
    price: 10,
  })
  await ticket.save()

  const expiration = new Date()
  expiration.setSeconds(
    expiration.getSeconds() + parseInt(process.env.EXPIRATION_WINDOW_SECONDS!, 10)
  )

  const order = Order.build({
    userId: 'id999',
    status: OrderStatus.Created,
    expiresAt: expiration,
    ticket,
  })
  await order.save()

  await request(app)
    .post('/api/orders')
    .set('Cookie', getAuthCookie('id999', 'test@test.com'))
    .send({ ticketdId: ticket.id })
    .expect(400)
})

it('returns 201 if reserves a ticket', async () => {
  const ticket = Ticket.build({
    title: 'Title value',
    price: 10,
  })
  await ticket.save()
  const responseCreatedOrder = await request(app)
    .post('/api/orders')
    .set('Cookie', getAuthCookie('id999', 'test@test.com'))
    .send({ ticketId: ticket.id })
    .expect(201)

  expect(responseCreatedOrder.body.ticket).toEqual(ticket.id)
})

it('publishes an event', async () => {
  const ticket = Ticket.build({
    title: 'Title value',
    price: 10,
  })
  await ticket.save()
  await request(app)
    .post('/api/orders')
    .set('Cookie', getAuthCookie('id999', 'test@test.com'))
    .send({ ticketId: ticket.id })
    .expect(201)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
