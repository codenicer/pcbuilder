import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../../app'
import { ItemCode } from '../../../models/item-code'
// import { natsWrapper } from '../../nats-wrapper';

it('returns 400 with invalid part-code arguement ', async () => {
  await request(app)
    .post('/api/parts/itemcode')
    .set('Cookie', global.signin())
    .send({
      code: '',
    })
    .expect(400)
})

it('create new part-code with valid  arguement', async () => {
  await request(app)
    .post('/api/parts/itemcode')
    .set('Cookie', global.signin())
    .send({
      code: 'code123',
    })
    .expect(201)

  const itemCode = await ItemCode.find()

  expect(itemCode.length).toEqual(1)
})
