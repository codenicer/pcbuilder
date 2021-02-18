import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../../app'
import { ItemType } from '../../../models/item-types'
// import { natsWrapper } from '../../nats-wrapper';

async function createItemType() {
  const itemType = ItemType.build({
    name: mongoose.Types.ObjectId().toHexString().slice(0, 5),
  })
  await itemType.save()
}

it('show all item type', async () => {
  for (let i = 0; i < 6; i++) {
    await createItemType()
  }

  const res = await request(app)
    .get(`/api/parts/itemtype/`)
    .set('Cookie', global.signin())
    .send()
    .expect(200)

  expect(res.body.length).toEqual(6)
})
