import request from 'supertest'

import { app } from '../../app'
import { getAuthCookie } from '../../test/cookie-helper'

async function createTicket(title: string, price: number){
  return await request(app)
      .post('/api/tickets')
      .set('Cookie', getAuthCookie('id999', 'test@test.com'))
      .send({ title: title, price: price })
      .expect(201)
}

it('has a route handler listening to /api/tickets for GET request', async () => {
  const response = await request(app).get('/api/tickets').set('Cookie', getAuthCookie('id999', 'test@test.com')).send({})
  expect(response.status).not.toEqual(404)
})

it('returns all tickets', async () => {
  const title1 = 'Title value 1'
  const price1 = 10

  const title2 = 'Title value 2'
  const price2 = 20

  const title3 = 'Title value 3'
  const price3 = 30

  await createTicket(title1, price1)
  await createTicket(title2, price2)
  await createTicket(title3, price3)

  const response = await request(app)
    .get('/api/tickets/')
    .set('Cookie', getAuthCookie('id999', 'test@test.com'))
    .expect(200)

  expect(response.body.length).toEqual(3)
})
