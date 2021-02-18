import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../../app'
import { Processor } from '../../../models/processor'

it('returns 404 if processor was not found', async () => {
  await request(app)
    .patch(`/api/parts/processor/${mongoose.Types.ObjectId().toHexString()}`)
    .set('Cookie', global.signin())
    .send({
      name: 'randomname',
    })
    .expect(404)
})

it('updates processor if provided valid arguments', async () => {
  const processor = Processor.build({
    name: 'processor',
  })

  await processor.save()

  const { _id: id } = processor

  await request(app)
    .patch(`/api/parts/processor/${id}`)
    .set('Cookie', global.signin())
    .send({
      name: 'updatedprocessorname',
    })
    .expect(200)

  let updatedProcessor = await Processor.findById(id)

  expect(updatedProcessor!.name).toEqual('updatedprocessorname')

  await request(app)
    .patch(`/api/parts/processor/${id}`)
    .set('Cookie', global.signin())
    .send({
      series: 'series',
    })
    .expect(200)

  updatedProcessor = await Processor.findById(id).populate('series')
  //@ts-ignore
  expect(updatedProcessor.series.name).toEqual('series')

  await request(app)
    .patch(`/api/parts/processor/${id}`)
    .set('Cookie', global.signin())
    .send({
      caches: [
        { name: 'caches', info: 'info1' },
        { name: 'caches', info: 'info2' },
      ],
    })
    .expect(200)

  updatedProcessor = await Processor.findById(id).populate('caches')
  //@ts-ignore
  expect(updatedProcessor.caches.length).toEqual(2)

  await request(app)
    .patch(`/api/parts/processor/${id}`)
    .set('Cookie', global.signin())
    .send({
      coreFamily: 'coreFamily',
    })
    .expect(200)

  updatedProcessor = await Processor.findById(id)

  expect(updatedProcessor!.coreFamily).toEqual('coreFamily')

  await request(app)
    .patch(`/api/parts/processor/${id}`)
    .set('Cookie', global.signin())
    .send({
      integratedGraphic: 'integratedGraphic',
    })
    .expect(200)

  updatedProcessor = await Processor.findById(id)

  expect(updatedProcessor!.integratedGraphic).toEqual('integratedGraphic')

  await request(app)
    .patch(`/api/parts/processor/${id}`)
    .set('Cookie', global.signin())
    .send({
      microarchitecture: 'microarchitecture',
    })
    .expect(200)

  updatedProcessor = await Processor.findById(id)

  expect(updatedProcessor!.microarchitecture).toEqual('microarchitecture')

  await request(app)
    .patch(`/api/parts/processor/${id}`)
    .set('Cookie', global.signin())
    .send({
      cpuModel: 'cpuModel',
    })
    .expect(200)

  updatedProcessor = await Processor.findById(id)

  expect(updatedProcessor!.cpuModel).toEqual('cpuModel')

  await request(app)
    .patch(`/api/parts/processor/${id}`)
    .set('Cookie', global.signin())
    .send({
      packaging: 'packaging',
    })
    .expect(200)

  updatedProcessor = await Processor.findById(id)

  expect(updatedProcessor!.packaging).toEqual('packaging')

  await request(app)
    .patch(`/api/parts/processor/${id}`)
    .set('Cookie', global.signin())
    .send({
      lithograpy: 'lithograpy',
    })
    .expect(200)

  updatedProcessor = await Processor.findById(id)

  expect(updatedProcessor!.lithograpy).toEqual('lithograpy')

  await request(app)
    .patch(`/api/parts/processor/${id}`)
    .set('Cookie', global.signin())
    .send({
      coreCount: 1,
    })
    .expect(200)

  updatedProcessor = await Processor.findById(id)

  expect(updatedProcessor!.coreCount).toEqual(1)

  await request(app)
    .patch(`/api/parts/processor/${id}`)
    .set('Cookie', global.signin())
    .send({
      threadCount: 1,
    })
    .expect(200)

  updatedProcessor = await Processor.findById(id)

  expect(updatedProcessor!.threadCount).toEqual(1)

  await request(app)
    .patch(`/api/parts/processor/${id}`)
    .set('Cookie', global.signin())
    .send({
      coreClock: 1,
    })
    .expect(200)

  updatedProcessor = await Processor.findById(id)

  expect(updatedProcessor!.coreClock).toEqual(1)

  await request(app)
    .patch(`/api/parts/processor/${id}`)
    .set('Cookie', global.signin())
    .send({
      boostClock: 1,
    })
    .expect(200)

  updatedProcessor = await Processor.findById(id)

  expect(updatedProcessor!.boostClock).toEqual(1)

  await request(app)
    .patch(`/api/parts/processor/${id}`)
    .set('Cookie', global.signin())
    .send({
      tdp: 1,
    })
    .expect(200)

  updatedProcessor = await Processor.findById(id)

  expect(updatedProcessor!.tdp).toEqual(1)

  expect(updatedProcessor!.boostClock).toEqual(1)

  await request(app)
    .patch(`/api/parts/processor/${id}`)
    .set('Cookie', global.signin())
    .send({
      maxSupportedMemory: 1,
    })
    .expect(200)

  updatedProcessor = await Processor.findById(id)

  expect(updatedProcessor!.maxSupportedMemory).toEqual(1)

  await request(app)
    .patch(`/api/parts/processor/${id}`)
    .set('Cookie', global.signin())
    .send({
      eccSupport: true,
    })
    .expect(200)

  updatedProcessor = await Processor.findById(id)

  expect(updatedProcessor!.eccSupport).toEqual(true)

  await request(app)
    .patch(`/api/parts/processor/${id}`)
    .set('Cookie', global.signin())
    .send({
      includesCpuCooler: true,
    })
    .expect(200)

  updatedProcessor = await Processor.findById(id)

  expect(updatedProcessor!.includesCpuCooler).toEqual(true)

  await request(app)
    .patch(`/api/parts/processor/${id}`)
    .set('Cookie', global.signin())
    .send({
      multithreading: true,
    })
    .expect(200)

  updatedProcessor = await Processor.findById(id)

  expect(updatedProcessor!.multithreading).toEqual(true)

  await request(app)
    .patch(`/api/parts/processor/${id}`)
    .set('Cookie', global.signin())
    .send({
      publish: false,
    })
    .expect(200)

  updatedProcessor = await Processor.findById(id)

  expect(updatedProcessor!.publish).toEqual(false)

  await request(app)
    .patch(`/api/parts/processor/${id}`)
    .set('Cookie', global.signin())
    .send({
      manufacturer: {
        name: 'manname',
        info: 'randominfo',
      },
    })
    .expect(200)

  updatedProcessor = await Processor.findById(id).populate('manufacturer')

  expect(updatedProcessor!.manufacturer.name).toEqual('manname')
  expect(updatedProcessor!.manufacturer.info).toEqual('randominfo')

  await request(app)
    .patch(`/api/parts/processor/${id}`)
    .set('Cookie', global.signin())
    .send({
      itemCode: ['qweqweq'],
    })
    .expect(200)

  updatedProcessor = await Processor.findById(id).populate('itemCode')

  expect(updatedProcessor!.itemCode.length).toEqual(1)

  await request(app)
    .patch(`/api/parts/processor/${id}`)
    .set('Cookie', global.signin())
    .send({
      itemImages: [{ name: 'wewe', url: 'qweqe' }],
    })
    .expect(200)

  updatedProcessor = await Processor.findById(id).populate('itemImages')

  expect(updatedProcessor!.itemImages.length).toEqual(1)

  await request(app)
    .patch(`/api/parts/processor/${id}`)
    .set('Cookie', global.signin())
    .send({
      measurements: {
        length: 1,
        width: 2,
        height: 3,
        dimension: 'dimension',
      },
    })
    .expect(200)

  updatedProcessor = await Processor.findById(id)
  expect(updatedProcessor!.measurements.length).toEqual(1)
  expect(updatedProcessor!.measurements.width).toEqual(2)
  expect(updatedProcessor!.measurements.height).toEqual(3)
  expect(updatedProcessor!.measurements.dimension).toEqual('dimension')
})
