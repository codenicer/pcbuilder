import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../../app'
import { Manufacturer } from '../../../models/manufacturer'
// import { natsWrapper } from '../../nats-wrapper';

it('returns 404 if manufacturer are not found ', async () => {
  const res = await request(app)
    .patch(`/api/parts/manufacturer/${mongoose.Types.ObjectId().toHexString()}`)
    .set('Cookie', global.signin())
    .send({
      name: 'randomname',
      info: 'randominfo',
    })
    .expect(404)
})

it('fail updating manufacturer with invalid arguement', async () => {
  const manufacturer = Manufacturer.build({
    name: 'randomname',
    info: 'randominfp',
  })

  await manufacturer.save()

  const response = await request(app)
    .patch(`/api/parts/manufacturer/${manufacturer._id}`)
    .set('Cookie', global.signin())
    .send({
      name: '',
    })
    .expect(400)

  expect(response.body.errors[0].message).toEqual(
    'Manufacturer name must be valid'
  )
})

it('update manufacturer with valid arguement', async () => {
  const manufacturer = Manufacturer.build({
    name: 'randomname',
  })

  await manufacturer.save()

  await request(app)
    .patch(`/api/parts/manufacturer/${manufacturer._id}`)
    .set('Cookie', global.signin())
    .send({
      name: 'randomname2',
    })
    .expect(200)

  const updatedColor = await Manufacturer.findById(manufacturer.id)

  expect(updatedColor?.name).toEqual('randomname2')
})

it('dont update manufacturer name if it already in use', async () => {
  const manufacturer1 = Manufacturer.build({
    name: 'randomname1',
  })

  const manufacturer2 = Manufacturer.build({
    name: 'randomname2',
  })

  await manufacturer1.save()
  await manufacturer2.save()

  const res = await request(app)
    .patch(`/api/parts/manufacturer/${manufacturer2._id}`)
    .set('Cookie', global.signin())
    .send({
      name: 'randomname1',
    })
    .expect(400)

  expect(res.body.errors[0].message).toEqual('Name is already in used')
})
