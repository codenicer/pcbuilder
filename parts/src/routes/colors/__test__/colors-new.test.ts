import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../../app'
import { Color } from '../../../models/colors'
import { Colors } from '@cnpcbuilder/common'
// import { natsWrapper } from '../../nats-wrapper';

it('returns 400 with invalid color arguement ', async () => {
  const response = await request(app)
    .post('/api/parts/color')
    .set('Cookie', global.signin())
    .send({
      color: 'wrong',
    })
    .expect(400)
})

it('create new color with valid color arguement', async () => {
  const res = await request(app)
    .post('/api/parts/color')
    .set('Cookie', global.signin())
    .send({
      color: 'green',
    })
    .expect(201)

  const colors = await Color.find()

  expect(colors.length).toEqual(1)
})

it('dont create new color if the color is already existed', async () => {
  const createColor = Color.build({
    color: Colors.Red,
  })

  createColor.save()

  const res = await request(app)
    .post('/api/parts/color')
    .set('Cookie', global.signin())
    .send({
      color: 'red',
    })
    .expect(400)

  expect(res.body.errors[0].message).toEqual('Color is already exist')
})
