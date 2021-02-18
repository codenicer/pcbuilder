import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../../app'
import { Color } from '../../../models/colors'
import { Colors } from '@cnpcbuilder/common'
// import { natsWrapper } from '../../nats-wrapper';

it('returns 404 if color are not found ', async () => {
  const res = await request(app)
    .get(`/api/parts/color/${mongoose.Types.ObjectId().toHexString()}`)
    .set('Cookie', global.signin())
    .send()
    .expect(404)
})

it('show color info if color found', async () => {
  const newcolor = Color.build({
    color: Colors.Green,
  })

  await newcolor.save()

  const res = await request(app)
    .get(`/api/parts/color/${newcolor.id}`)
    .set('Cookie', global.signin())
    .send()

  expect(res.body.id).toEqual(newcolor.id)
})
