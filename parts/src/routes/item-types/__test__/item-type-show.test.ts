import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../../app'
import { ItemType } from '../../../models/item-types'
// import { natsWrapper } from '../../nats-wrapper';

it('returns 404 if item type are not found ', async () => {
  await request(app)
    .get(`/api/parts/itemtype/${mongoose.Types.ObjectId().toHexString()}`)
    .set('Cookie', global.signin())
    .send()
    .expect(404)
})

it('show item type info if found', async () => {
  const itemType = ItemType.build({
    name: 'randomname',
  })

  await itemType.save()

  const res = await request(app)
    .get(`/api/parts/itemtype/${itemType.id}`)
    .set('Cookie', global.signin())
    .send()

  expect(res.body.id).toEqual(itemType.id)
})
