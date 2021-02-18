import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../../app'
import { Processor } from '../../../models/processor'

// import { natsWrapper } from '../../nats-wrapper';

it('returns 400 with invalid processor arguments', async () => {
  await request(app)
    .post('/api/parts/processor')
    .set('Cookie', global.signin())
    .send({
      name: 1,
    })
    .expect(400)

  await request(app)
    .post('/api/parts/processor')
    .set('Cookie', global.signin())
    .send({
      name: 'processorname',
      series: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/processor')
    .set('Cookie', global.signin())
    .send({
      name: 'processorname',
      caches: [],
    })
    .expect(400)

  await request(app)
    .post('/api/parts/processor')
    .set('Cookie', global.signin())
    .send({
      name: 'processorname',
      coreFamily: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/processor')
    .set('Cookie', global.signin())
    .send({
      name: 'processorname',
      integratedGraphic: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/processor')
    .set('Cookie', global.signin())
    .send({
      name: 'processorname',
      microarchitecture: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/processor')
    .set('Cookie', global.signin())
    .send({
      name: 'processorname',
      cpuModel: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/processor')
    .set('Cookie', global.signin())
    .send({
      name: 'processorname',
      packaging: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/processor')
    .set('Cookie', global.signin())
    .send({
      name: 'processorname',
      lithograpy: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/processor')
    .set('Cookie', global.signin())
    .send({
      name: 'processorname',
      coreCount: 'qweqweq',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/processor')
    .set('Cookie', global.signin())
    .send({
      name: 'processorname',
      coreClock: 'qweqweq',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/processor')
    .set('Cookie', global.signin())
    .send({
      name: 'processorname',
      threadCount: 'qweqweq',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/processor')
    .set('Cookie', global.signin())
    .send({
      name: 'processorname',
      boostClock: 'qweqweq',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/processor')
    .set('Cookie', global.signin())
    .send({
      name: 'processorname',
      tdp: 'qweqweq',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/processor')
    .set('Cookie', global.signin())
    .send({
      name: 'processorname',
      maxSupportedMemory: 'qweqweq',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/processor')
    .set('Cookie', global.signin())
    .send({
      name: 'processorname',
      eccSupport: 'qweqweq',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/processor')
    .set('Cookie', global.signin())
    .send({
      name: 'processorname',
      includesCpuCooler: 'qweqweq',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/processor')
    .set('Cookie', global.signin())
    .send({
      name: 'processorname',
      multithreading: 'qweqweq',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/processor')
    .set('Cookie', global.signin())
    .send({
      name: 'processorname',
      manufacturer: {},
    })
    .expect(400)

  await request(app)
    .post('/api/parts/processor')
    .set('Cookie', global.signin())
    .send({
      name: 'processorname',
      itemCode: 123,
    })
    .expect(400)

  await request(app)
    .post('/api/parts/processor')
    .set('Cookie', global.signin())
    .send({
      name: 'processorname',
      itemImages: [],
    })
    .expect(400)

  await request(app)
    .post('/api/parts/processor')
    .set('Cookie', global.signin())
    .send({
      name: 'processorname',
      measurements: {
        length: 1,
        height: 2,
        width: 'qweqwe',
        dimension: 'qweqwe',
      },
    })
    .expect(400)
})

it('dont create duplicate processor name', async () => {
  const processor = Processor.build({
    name: 'processorname',
  })

  await processor.save()

  const res = await request(app)
    .post('/api/parts/processor')
    .set('Cookie', global.signin())
    .send({
      name: 'processorname',
    })

  expect(res.body.errors[0].message).toEqual('Name is already exist')
})

it('create new processor if provided valid argument', async () => {
  await request(app)
    .post('/api/parts/processor')
    .set('Cookie', global.signin())
    .send({
      name: 'processorname',
    })

  expect((await Processor.find()).length).toEqual(1)
})
