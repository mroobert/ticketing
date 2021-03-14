import request from 'supertest'

import { app } from '../../app'
import { getAuthCookie } from '../../test/cookie-helper'
import { generateId } from '../../test/generate-id-helper'
import { createOrder } from '../../test/create-order-helper'

it('can only be accessed if the user is signed in', async () => {
  const id = generateId()
  await request(app).get(`/api/orders/${id}`).send({}).expect(401)
})

it('the requested order can be accessed only if belongs to the user that is making the request ', async () => {
  const user1 = {
    id: 'id999',
    email: 'test1@test.com',
  }
  const user2 = {
    id: 'id888',
    email: 'test2@test.com',
  }

  const title = 'Title value 1'
  const price = 20

  const { body: order } = await createOrder(title, price, user2)

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', getAuthCookie(user1.id, user1.email))
    .expect(401)
})

it('returns the order requested for the user that is making the request', async () => {
  const user = {
    id: 'id999',
    email: 'test@test.com',
  }
  const title = 'Title value 1'
  const price = 10

  const { body: order } = await createOrder(title, price, user)
  const response = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', getAuthCookie(user.id, user.email))
    .expect(200)

  expect(response.body.id).toEqual(order.id)
  expect(response.body.userId).toEqual(user.id)
  expect(response.body.ticket.id).toEqual(order.ticket)
})
