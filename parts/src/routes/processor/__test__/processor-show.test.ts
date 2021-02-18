import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../../app'
// import { natsWrapper } from '../../nats-wrapper';

it('returns 404 if processor was not found', async () => {
  await request(app)
    .get(`/api/parts/processor/${mongoose.Types.ObjectId().toHexString()}`)
    .set('Cookie', global.signin())
    .send()
    .expect(404)
})

it('show processor info ', async () => {
  const res = await request(app)
    .post('/api/parts/processor')
    .set('Cookie', global.signin())
    .send({
      name: 'randomname',
      series: 'series',
      caches: [
        { name: 'cache1', info: 'info1' },
        { name: 'cache2', info: 'info2' },
      ],
      coreFamily: 'coreFamily',
      integratedGraphic: 'integratedGraphic',
      microarchitecture: 'microarchitecture',
      cpuModel: 'cpuModel',
      packaging: 'packaging',
      lithograpy: 'lithograpy',
      coreCount: 1,
      threadCount: 1,
      coreClock: 1,
      boostClock: 1,
      tdp: 1,
      maxSupportedMemory: 1,
      eccSupport: true,
      includesCpuCooler: true,
      multithreading: true,
      publish: true,
    })
    .expect(201)

  await request(app)
    .get(`/api/parts/processor/${res.body.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(200)
})
