import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../../app'
import { Color } from '../../../models/colors'
import { Colors } from '@cnpcbuilder/common'
// import { natsWrapper } from '../../nats-wrapper';

it('returns 404 if color are not found ', async () => {
  const response = await request(app)
    .patch(`/api/parts/color/${mongoose.Types.ObjectId().toHexString()}`)
    .set('Cookie', global.signin())
    .send({
      color: 'black',
    })
    .expect(404)
})

it('if fail updating color with invalid arguement', async () => {
  const color = Color.build({
    color: Colors.Black,
  })

  await color.save()

  const response = await request(app)
    .patch(`/api/parts/color/${color._id}`)
    .set('Cookie', global.signin())
    .send({
      color: 'test',
    })
    .expect(400)

  expect(response.body.errors[0].message).toEqual('Invalid color')
})

it('update color with valid arguement', async () => {
  const color = Color.build({
    color: Colors.Black,
  })

  await color.save()

  const response = await request(app)
    .patch(`/api/parts/color/${color._id}`)
    .set('Cookie', global.signin())
    .send({
      color: 'green',
    })
    .expect(200)

  const updatedColor = await Color.findById(color.id)

  expect(updatedColor?.color).toEqual('green')
})

it('donst update color if the color name is already in used', async () => {
  const color1 = Color.build({
    color: Colors.Green,
  })
  const color2 = Color.build({
    color: Colors.Black,
  })

  await color1.save()
  await color2.save()

  const res = await request(app)
    .patch(`/api/parts/color/${color2.id}`)
    .set('Cookie', global.signin())
    .send({
      color: Colors.Green,
    })
    .expect(400)

  expect(res.body.errors[0].message).toEqual('Color is already exist')
})
