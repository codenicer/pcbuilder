import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../../app'
import { ItemCode } from '../../../models/item-code'
// import { natsWrapper } from '../../nats-wrapper';

it('returns 404 if part-code are not found ', async () => {
  await request(app)
    .get(`/api/parts/itemcode/${mongoose.Types.ObjectId().toHexString()}`)
    .set('Cookie', global.signin())
    .send()
    .expect(404)
})

it('show color info if part-code found', async () => {
  const itemCode = ItemCode.build({
    code: 'testcode123',
  })

  await itemCode.save()

  const res = await request(app)
    .get(`/api/parts/itemcode/${itemCode.id}`)
    .set('Cookie', global.signin())
    .send()

  expect(res.body.id).toEqual(itemCode.id)
})
