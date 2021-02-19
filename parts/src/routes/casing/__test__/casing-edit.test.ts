import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../../app'
import { Casing } from '../../../models/casing'
import { Items } from '../../../models/items'

it('returns 404 if casing was not found', async () => {
  await request(app)
    .patch(`/api/parts/casing/${mongoose.Types.ObjectId().toHexString()}`)
    .set('Cookie', global.signin())
    .send({
      name: 'randomname',
    })
    .expect(404)
})

it('updates casing if provided valid arguments', async () => {
  const itemInfo = Items.build({
    name: 'casingname',
  })

  await itemInfo.save()

  const casing = Casing.build({
    itemInfo,
  })

  await casing.save()

  const { _id: id } = casing

  await request(app)
    .patch(`/api/parts/casing/${id}`)
    .set('Cookie', global.signin())
    .send({
      name: 'updatedcasingname',
    })
    .expect(200)

  let updatedCasing = await Casing.findById(id).populate('itemInfo')

  expect(updatedCasing?.itemInfo!.name).toEqual('updatedcasingname')
})
