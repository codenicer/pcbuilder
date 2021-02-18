import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../../app'
import { Memory } from '../../../models/memory'

// import { natsWrapper } from '../../nats-wrapper';

it('returns 400 with invalid memory arguments', async () => {
  await request(app)
    .post('/api/parts/memory')
    .set('Cookie', global.signin())
    .send({
      name: 1,
    })
    .expect(400)

  await request(app)
    .post('/api/parts/memory')
    .set('Cookie', global.signin())
    .send({
      name: 'memoryname',
      memorySpeed: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/memory')
    .set('Cookie', global.signin())
    .send({
      name: 'memoryname',
      memoryType: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/memory')
    .set('Cookie', global.signin())
    .send({
      name: 'memoryname',
      module: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/memory')
    .set('Cookie', global.signin())
    .send({
      name: 'memoryname',
      timing: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/memory')
    .set('Cookie', global.signin())
    .send({
      name: 'memoryname',
      casLatency: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/memory')
    .set('Cookie', global.signin())
    .send({
      name: 'memoryname',
      pricePerGb: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/memory')
    .set('Cookie', global.signin())
    .send({
      name: 'memoryname',
      voltage: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/memory')
    .set('Cookie', global.signin())
    .send({
      name: 'memoryname',
      heatSpreader: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/memory')
    .set('Cookie', global.signin())
    .send({
      name: 'memoryname',
      manufacturer: {},
    })
    .expect(400)

  await request(app)
    .post('/api/parts/memory')
    .set('Cookie', global.signin())
    .send({
      name: 'memoryname',
      itemCode: 123,
    })
    .expect(400)

  await request(app)
    .post('/api/parts/memory')
    .set('Cookie', global.signin())
    .send({
      name: 'memoryname',
      itemImages: [],
    })
    .expect(400)

  await request(app)
    .post('/api/parts/memory')
    .set('Cookie', global.signin())
    .send({
      name: 'memoryname',
      measurements: {
        length: 1,
        height: 2,
        width: 'qweqwe',
        dimension: 'qweqwe',
      },
    })
})

it('dont create duplicate memory name', async () => {
  const memory = Memory.build({
    name: 'memoryname',
  })

  await memory.save()

  const res = await request(app)
    .post('/api/parts/memory')
    .set('Cookie', global.signin())
    .send({
      name: 'memoryname',
    })

  expect(res.body.errors[0].message).toEqual('Name is already exist')
})

it('create new memory if provided valid argument', async () => {
  await request(app)
    .post('/api/parts/memory')
    .set('Cookie', global.signin())
    .send({
      name: 'memoryname',
    })

  expect((await Memory.find()).length).toEqual(1)
})
