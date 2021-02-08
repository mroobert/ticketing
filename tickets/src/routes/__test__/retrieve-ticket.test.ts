import request from 'supertest'
import mongoose from 'mongoose'

import { app } from '../../app'
import { getAuthCookie } from '../../test/cookie-helper'
import { generateId } from '../../test/generate-id-helper'

it('responds with status 404 when a ticket is not found', async () => {
  const id = generateId()
  await request(app)
    .get(`/api/tickets/${id}`)
    .set('Cookie', getAuthCookie('id999', 'test@test.com'))
    .expect(404)
})

it('responds with status 200 and returns the ticket when it is found', async () => {
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
