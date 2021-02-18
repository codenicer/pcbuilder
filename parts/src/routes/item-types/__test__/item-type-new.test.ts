import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../../app'
import { ItemType } from '../../../models/item-types'

// import { natsWrapper } from '../../nats-wrapper';

it('returns 400 with invalid item type name arguement ', async () => {
  await request(app)
    .post('/api/parts/itemtype')
    .set('Cookie', global.signin())
    .send({
      name: '',
    })
    .expect(400)
})

it('create new item type with valid arguement', async () => {
  const res = await request(app)
    .post('/api/parts/itemtype')
    .set('Cookie', global.signin())
    .send({
      name: 'randomname',
    })
    .expect(201)

  const itemType = await ItemType.find()

  expect(itemType.length).toEqual(1)
})

it('dont create new item type if already existed', async () => {
  await request(app)
    .post('/api/parts/itemtype')
    .set('Cookie', global.signin())
    .send({
      name: 'randomname',
      info: 'randominfo',
    })
    .expect(201)

  const itemType = await ItemType.find()

  expect(itemType.length).toEqual(1)

  const res = await request(app)
    .post('/api/parts/itemtype')
    .set('Cookie', global.signin())
    .send({
      name: 'randomname',
      info: 'randominfo',
    })
    .expect(400)

  expect(res.body.errors[0].message).toEqual('Name is already in used')
})
