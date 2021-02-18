import request from 'supertest'
import { app } from '../../app'

it('returns a 201 on successful signup', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      ...global.sampleUser,
    })
    .expect(201)
})

it('validate email if an invalid email recieved in the body', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      ...global.sampleUser,
      email: '',
    })
    .expect(400)

  expect(response.body.errors[0].message).toEqual('Email must be valid')
})

it('validate password if an invalid password recieved in the body ', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      ...global.sampleUser,
      password: '',
    })
    .expect(400)

  expect(response.body.errors[0].message).toEqual(
    'Password must be between 4 and 20 characters and no spaces'
  )
})

it('validate username if an invalid username recieved in the body', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      ...global.sampleUser,
      username: '',
    })
    .expect(400)

  expect(response.body.errors[0].message).toEqual(
    'Username is must be between 4 and 20 characters'
  )
})

it('validate first name if an invalid firstname recieved in the body', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      ...global.sampleUser,
      firstName: '',
    })
    .expect(400)

  expect(response.body.errors[0].message).toEqual(
    'First name is must be between 4 and 20 characters'
  )
})

it('validate last name if an invalid last name recieved in the body', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      ...global.sampleUser,
      lastName: '',
    })
    .expect(400)

  expect(response.body.errors[0].message).toEqual(
    'Last name is must be between 4 and 20 characters'
  )
})

it('validate middle name if an invalid middle name recieved in the body', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      ...global.sampleUser,
      middleName: '',
    })
    .expect(400)

  expect(response.body.errors[0].message).toEqual(
    'Middle name is must be between 4 and 20 characters'
  )
})

it('disallows duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      ...global.sampleUser,
      username: 'username1',
    })
    .expect(201)

  const response = await request(app)
    .post('/api/users/signup')
    .send(global.sampleUser)

  expect(response.body.errors[0].message).toEqual('Email is in use')
})

it('disallows duplicate username', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      ...global.sampleUser,
      email: 'test8@test.com',
    })
    .expect(201)

  const response = await request(app)
    .post('/api/users/signup')
    .send(global.sampleUser)

  expect(response.body.errors[0].message).toEqual('Username is in use')
})

it('sets a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send(global.sampleUser)
    .expect(201)

  expect(response.get('Set-Cookie')).toBeDefined()
})
