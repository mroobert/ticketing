import request from 'supertest'

import { app } from '../../app'
import { getAuthCookie } from '../../test/cookie-helper'
import { generateId } from '../../test/generate-id-helper'
import { natsWrapper } from '../../nats-wrapper'

it('returns 400 and error message if an invalid title is provided', async () => {
  const id = generateId()
  const response = await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', getAuthCookie('id999', 'test@test.com'))
    .send({ title: '', price: '10' })
    .expect(400)

  expect(response.body.errors[0].message).toEqual('Title is required.')
})

it('returns 400 and error message if an invalid price is provided', async () => {
  const id = generateId()
  const cookie = getAuthCookie('id999', 'test@test.com')
  const responseNoPrice = await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send({ title: 'Title value' })
    .expect(400)

  const responseNegativePrice = await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send({ title: 'Title value', price: -10 })
    .expect(400)

  expect(responseNoPrice.body.errors[0].message).toEqual('Price must be greater than 0.')
  expect(responseNegativePrice.body.errors[0].message).toEqual('Price must be greater than 0.')
})

it('return 404 if the provided id does not exists', async () => {
  const id = generateId()
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', getAuthCookie('id999', 'test@test.com'))
    .send({ title: 'Title value', price: 10 })
    .expect(404)
})

it('return 401 NOT AUTHORIZED if not signed in', async () => {
  const id = generateId()
  await request(app).put(`/api/tickets/${id}`).send({ title: 'Title value', price: 10 }).expect(401)
})

it('return 401 NOT AUTHORIZED if the user does not own the ticket', async () => {
  const createTicketResponse = await request(app)
    .post('/api/tickets')
    .set('Cookie', getAuthCookie('id999', 'test@test.com'))
    .send({ title: 'Title value', price: 10 })
    .expect(201)

  await request(app)
    .put(`/api/tickets/${createTicketResponse.body.id}`)
    .set('Cookie', getAuthCookie('id888', 'test2@test.com'))
    .send({ title: 'Updated title value', price: 20 })
    .expect(401)
})

it('updates a ticket for valid inputs', async () => {
  const initialTitle = 'Title value'
  const initialPrice = 10

  const cookie = getAuthCookie('id999', 'test@test.com')

  const createTicketResponse = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: initialTitle, price: initialPrice })
    .expect(201)

  const { id: createdId } = createTicketResponse.body
  const updatedTitle = 'Updated title value'
  const updatedPrice = 20

  const updateTicketResponse = await request(app)
    .put(`/api/tickets/${createdId}`)
    .set('Cookie', cookie)
    .send({ title: updatedTitle, price: updatedPrice })
    .expect(200)

  expect(updateTicketResponse.body.title).toEqual(updatedTitle)
  expect(updateTicketResponse.body.price).toEqual(updatedPrice)
})

it('publishes an event', async () => {
  const initialTitle = 'Title value'
  const initialPrice = 10

  const cookie = getAuthCookie('id999', 'test@test.com')

  const createTicketResponse = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: initialTitle, price: initialPrice })
    .expect(201)

  const { id: createdId } = createTicketResponse.body
  const updatedTitle = 'Updated title value'
  const updatedPrice = 20

  await request(app)
    .put(`/api/tickets/${createdId}`)
    .set('Cookie', cookie)
    .send({ title: updatedTitle, price: updatedPrice })
    .expect(200)

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2)
})
