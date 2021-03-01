import request from 'supertest'

import { app } from '../../app'
import { getAuthCookie } from '../../test/cookie-helper'
import { natsWrapper } from '../../nats-wrapper'

it('has a route handler listening to /api/tickets for POST request', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', getAuthCookie('id999', 'test@test.com'))
    .send({})
  expect(response.status).not.toEqual(404)
})

it('can only be accessed if the user is signed in', async () => {
  await request(app).post('/api/tickets').send({}).expect(401)
})

it('it returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', getAuthCookie('id999', 'test@test.com'))
    .send({})
  expect(response.status).not.toEqual(401)
})

it('returns 400 and error message if an invalid title is provided', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', getAuthCookie('id999', 'test@test.com'))
    .send({ title: '', price: '10' })
    .expect(400)

  expect(response.body.errors[0].message).toEqual('Title is required.')
})

it('returns 400 and error message if an invalid price is provided', async () => {
  const cookie = getAuthCookie('id999', 'test@test.com')
  const responseNoPrice = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'Title value' })
    .expect(400)

  const responseNegativePrice = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'Title value', price: -10 })
    .expect(400)

  expect(responseNoPrice.body.errors[0].message).toEqual('Price must be greater than 0.')
  expect(responseNegativePrice.body.errors[0].message).toEqual('Price must be greater than 0.')
})

it('creates a ticket for valid inputs', async () => {
  const title = 'Title value'
  const price = 10
  const cookie = getAuthCookie('id999', 'test@test.com')

  const responseCreateTicket = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title, price })
    .expect(201)
  const { id: createdId } = responseCreateTicket.body

  const responseRetrieveTicket = await request(app)
    .get(`/api/tickets/${createdId}`)
    .set('Cookie', cookie)
    .expect(200)

  const {
    id: retrievedId,
    title: retrievedTitle,
    price: retrievedPrice,
  } = responseRetrieveTicket.body

  expect(retrievedId).toEqual(createdId)
  expect(retrievedTitle).toEqual(title)
  expect(retrievedPrice).toEqual(price)
})

it('publishes an event', async () => {
  const title = 'Title value'
  const price = 10
  const cookie = getAuthCookie('id999', 'test@test.com')

  await request(app).post('/api/tickets').set('Cookie', cookie).send({ title, price }).expect(201)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
