import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../../app'
import { Manufacturer } from '../../../models/manufacturer'

// import { natsWrapper } from '../../nats-wrapper';

it('returns 400 with invalid manufacturer name arguement ', async () => {
  await request(app)
    .post('/api/parts/manufacturer')
    .set('Cookie', global.signin())
    .send({
      name: '',
    })
    .expect(400)
})

it('create new manufacturer with valid arguement', async () => {
  const res = await request(app)
    .post('/api/parts/manufacturer')
    .set('Cookie', global.signin())
    .send({
      name: 'randomname',
      info: 'randominfo',
    })
    .expect(201)

  const manufacturer = await Manufacturer.find()

  expect(manufacturer.length).toEqual(1)
})

it('dont create new manufacturer if already existed', async () => {
  await request(app)
    .post('/api/parts/manufacturer')
    .set('Cookie', global.signin())
    .send({
      name: 'randomname',
      info: 'randominfo',
    })
    .expect(201)

  const manufacturer = await Manufacturer.find()

  expect(manufacturer.length).toEqual(1)

  const res = await request(app)
    .post('/api/parts/manufacturer')
    .set('Cookie', global.signin())
    .send({
      name: 'randomname',
      info: 'randominfo',
    })
    .expect(400)

  expect(res.body.errors[0].message).toEqual('Name is already in used')
})
