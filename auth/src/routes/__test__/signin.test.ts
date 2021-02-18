import request from 'supertest'
import { app } from '../../app'

it('fails when a email that does not exist is supplied', async () => {
  const response = await request(app)
    .post('/api/users/signin')
    .send({
      username: 'username',
      password: 'password',
    })
    .expect(400)

  expect(response.body.errors[0].message).toEqual('Invalid credentials')
})

it('fails when an incorrect password is supplied', async () => {
  await request(app)
    .post('/api/users/signup')
    .send(global.sampleUser)
    .expect(201)

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      username: global.sampleUser,
      password: 'aslkdfjalskdfj',
    })
    .expect(400)

  expect(response.body.errors[0].message).toEqual('Invalid credentials')
})

it('responds with a cookie when given valid credentials', async () => {
  await request(app)
    .post('/api/users/signup')
    .send(global.sampleUser)
    .expect(201)

  const response = await request(app)
    .post('/api/users/signin')
    .send(global.sampleUser)
    .expect(200)

  expect(response.get('Set-Cookie')).toBeDefined()
})
