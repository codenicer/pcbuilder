import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../../app'
import { Memory } from '../../../models/memory'
// import { natsWrapper } from '../../nats-wrapper';

it('returns 404 if memory was not found', async () => {
  await request(app)
    .get(`/api/parts/memory/${mongoose.Types.ObjectId().toHexString()}`)
    .set('Cookie', global.signin())
    .send()
    .expect(404)
})

it('show memory info ', async () => {
  const res = await request(app)
    .post('/api/parts/memory')
    .set('Cookie', global.signin())
    .send({
      name: 'memory name412151472q',
      memorySpeed: 'memorySpeed',
      memoryType: 'memoryType',
      module: 'module',
      timing: 'timing',
      casLatency: 123,
      pricePerGb: 123,
      voltage: 123,
      heatSpreader: false,
      manufacturer: {
        name: 'manufacturer',
        info: 'manufacturerinfo',
      },
      itemCode: ['itemCode1', 'itemCode2'],
      itemImages: [
        { name: 'name', url: 'url' },
        { name: 'name1', url: 'url1' },
      ],
      measurements: {
        length: 1,
        width: 2,
        height: 3,
        dimension: 'dimension',
      },
    })
    .expect(201)

  await request(app)
    .get(`/api/parts/memory/${res.body.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(200)
})
