import request from 'supertest'
import { OrderStatus } from '@playedby/common'

import { app } from '../../app'
import { getAuthCookie } from '../../test/cookie-helper'
import { generateId } from '../../test/generate-id-helper'
import { createOrder } from '../../test/create-order-helper'
import { Order } from '../../models'
import { natsWrapper } from '../../nats-wrapper'

it('can only be accessed if the user is signed in', async () => {
  const id = generateId()
  await request(app).patch(`/api/orders/${id}`).send({}).expect(401)
})

it('marking an order as cancelled can be done only if belongs to the user that is making the request ', async () => {
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
    .patch(`/api/orders/${order.id}`)
    .set('Cookie', getAuthCookie(user1.id, user1.email))
    .expect(401)
})

it('marks the order as cancelled for the user that is making the request', async () => {
  const user = {
    id: 'id999',
    email: 'test@test.com',
  }
  const title = 'Title value 1'
  const price = 10

  const { body: order } = await createOrder(title, price, user)
  await request(app)
    .patch(`/api/orders/${order.id}`)
    .set('Cookie', getAuthCookie(user.id, user.email))
    .expect(204)

  const createdOrder = await Order.findById(order.id)
  expect(createdOrder!.userId).toEqual(user.id)
  expect(createdOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('publishes an event', async () => {
  const user = {
    id: 'id999',
    email: 'test@test.com',
  }
  const title = 'Title value 1'
  const price = 10

  const { body: order } = await createOrder(title, price, user)
  await request(app)
    .patch(`/api/orders/${order.id}`)
    .set('Cookie', getAuthCookie(user.id, user.email))
    .expect(204)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
