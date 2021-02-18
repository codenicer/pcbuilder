import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../../app'
import { ItemType } from '../../../models/item-types'
// import { natsWrapper } from '../../nats-wrapper';

it('returns 404 if item type are not found ', async () => {
  const res = await request(app)
    .patch(`/api/parts/itemtype/${mongoose.Types.ObjectId().toHexString()}`)
    .set('Cookie', global.signin())
    .send({
      name: 'randomname',
    })
    .expect(404)
})

it('fail updating item type with invalid arguement', async () => {
  const itemType = ItemType.build({
    name: 'randomname',
  })

  await itemType.save()

  const response = await request(app)
    .patch(`/api/parts/itemtype/${itemType._id}`)
    .set('Cookie', global.signin())
    .send({
      name: '',
    })
    .expect(400)

  expect(response.body.errors[0].message).toEqual(
    'Item type name must be valid'
  )
})

it('update item type with valid arguement', async () => {
  const itemType = ItemType.build({
    name: 'randomname',
  })

  await itemType.save()

  await request(app)
    .patch(`/api/parts/itemtype/${itemType._id}`)
    .set('Cookie', global.signin())
    .send({
      name: 'randomname2',
    })
    .expect(200)

  const updatedColor = await ItemType.findById(itemType.id)

  expect(updatedColor?.name).toEqual('randomname2')
})

it('dont update item type name if it already in use', async () => {
  const itemType1 = ItemType.build({
    name: 'randomname1',
  })

  const itemType2 = ItemType.build({
    name: 'randomname2',
  })

  await itemType1.save()
  await itemType2.save()

  const res = await request(app)
    .patch(`/api/parts/itemtype/${itemType2._id}`)
    .set('Cookie', global.signin())
    .send({
      name: 'randomname1',
    })
    .expect(400)

  expect(res.body.errors[0].message).toEqual('Name is already in used')
})
