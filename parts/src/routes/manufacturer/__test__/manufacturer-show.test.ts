import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../../app'
import { Manufacturer } from '../../../models/manufacturer'
// import { natsWrapper } from '../../nats-wrapper';

it('returns 404 if manufacturer are not found ', async () => {
  await request(app)
    .get(`/api/parts/manufacturer/${mongoose.Types.ObjectId().toHexString()}`)
    .set('Cookie', global.signin())
    .send()
    .expect(404)
})

it('show manufacturer info if found', async () => {
  const manufacturer = Manufacturer.build({
    name: 'randomname',
    info: 'randominfo',
  })

  await manufacturer.save()

  const res = await request(app)
    .get(`/api/parts/manufacturer/${manufacturer.id}`)
    .set('Cookie', global.signin())
    .send()

  expect(res.body.id).toEqual(manufacturer.id)
})
