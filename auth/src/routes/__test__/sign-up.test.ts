import request from 'supertest'

import { app } from '../../app'

it('returns a 201 on succesful signup', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201)
})

it('returns a 400 for invalid email', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'invalidemail',
      password: 'password',
    })
    .expect(400)
})

it('returns a 400 for invalid password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'p',
    })
    .expect(400)
})

it('returns a 400 for missing email or password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
    })
    .expect(400)

  await request(app)
    .post('/api/users/signup')
    .send({
      password: 'password',
    })
    .expect(400)
})

it('returns a 400 for duplicated emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201)

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password2',
    })
    .expect(400)
})

it('sets a cookie after succesful sign up', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201)

  expect(response.get('Set-Cookie')).toBeDefined()
})
