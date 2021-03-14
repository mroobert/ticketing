import request from 'supertest'

import { app } from '../../app'
import { getAuthCookie } from '../../test/cookie-helper'
import { createOrder } from '../../test/create-order-helper'

it('has a route handler listening to /api/orders for GET request', async () => {
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', getAuthCookie('id999', 'test@test.com'))
    .send({})
  expect(response.status).not.toEqual(404)
})

it('can only be accessed if the user is signed in', async () => {
  await request(app).get('/api/orders').send({}).expect(401)
})

it('returns all orders for the user ID that is making the request', async () => {
  const user1 = {
    id: 'id999',
    email: 'test1@test.com',
  }
  const title1 = 'Title value 1'
  const price1 = 10

  const title2 = 'Title value 2'
  const price2 = 20

  const title3 = 'Title value 3'
  const price3 = 30

  const { body: order1User1 } = await createOrder(title1, price1, user1)
  const { body: order2User1 } = await createOrder(title2, price2, user1)
  const { body: order3User1 } = await createOrder(title3, price3, user1)

  const responseForUser1 = await request(app)
    .get('/api/orders/')
    .set('Cookie', getAuthCookie(user1.id, user1.email))
    .expect(200)

  expect(responseForUser1.body.length).toEqual(3)
  expect(responseForUser1.body[0].userId).toEqual(user1.id)
  expect(responseForUser1.body[1].userId).toEqual(user1.id)
  expect(responseForUser1.body[2].userId).toEqual(user1.id)
  expect(responseForUser1.body[0].id).toEqual(order1User1.id)
  expect(responseForUser1.body[1].id).toEqual(order2User1.id)
  expect(responseForUser1.body[2].id).toEqual(order3User1.id)

  const user2 = {
    id: 'id111',
    email: 'test2@test.com',
  }

  const { body: order1User2 } = await createOrder(title1, price1, user2)
  const { body: order2User2 } = await createOrder(title2, price2, user2)

  const responseForUser2 = await request(app)
    .get('/api/orders/')
    .set('Cookie', getAuthCookie(user2.id, user2.email))
    .expect(200)

  expect(responseForUser2.body.length).toEqual(2)
  expect(responseForUser2.body[0].userId).toEqual(user2.id)
  expect(responseForUser2.body[1].userId).toEqual(user2.id)
  expect(responseForUser2.body[0].id).toEqual(order1User2.id)
  expect(responseForUser2.body[1].id).toEqual(order2User2.id)
})
