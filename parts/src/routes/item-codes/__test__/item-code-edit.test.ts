import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../../app'
import { ItemCode } from '../../../models/item-code'
// import { natsWrapper } from '../../nats-wrapper';

it('returns 404 if part-code are not found ', async () => {
  await request(app)
    .patch(`/api/parts/itemcode/${mongoose.Types.ObjectId().toHexString()}`)
    .set('Cookie', global.signin())
    .send({
      code: 'testcode',
    })
    .expect(404)
})

it('fail updating part-code with invalid arguement', async () => {
  const itemCode = ItemCode.build({
    code: 'testcode',
  })

  await itemCode.save()

  const response = await request(app)
    .patch(`/api/parts/itemcode/${itemCode._id}`)
    .set('Cookie', global.signin())
    .send({
      code: '',
    })
    .expect(400)

  expect(response.body.errors[0].message).toEqual('Code must be defined')
})

it('update part-code with valid arguement', async () => {
  const itemCode = ItemCode.build({
    code: 'testcode123',
  })

  await itemCode.save()

  await request(app)
    .patch(`/api/parts/itemcode/${itemCode._id}`)
    .set('Cookie', global.signin())
    .send({
      code: 'test321',
    })
    .expect(200)

  const updatedItemCode = await ItemCode.findById(itemCode.id)

  expect(updatedItemCode?.code).toEqual('test321')
})
