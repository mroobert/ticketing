import request from 'supertest'

import { app } from '../../app'

it('returns a 200 on succesful signin', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201)

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(200)
})

it('returns a 400 for a invalid email', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'invalidemail',
      password: 'password',
    })
    .expect(400)
})

it('returns a 400 for a missing password', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'invalidemail',
      password: 'password',
    })
    .expect(400)
})

it('returns a 400 for non existing user', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'nonexisting@test.com',
      password: 'password',
    })
    .expect(400)
})

it('returns a 400 for password unmatched', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201)

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'unmatched',
    })
    .expect(400)
})

it('sets a cookie after succesful sign in', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201)

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(200)

  expect(response.get('Set-Cookie')).toBeDefined()
})
