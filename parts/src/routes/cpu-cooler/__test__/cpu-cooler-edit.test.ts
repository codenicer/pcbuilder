import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../../app'
import { CpuCooler } from '../../../models/cpu-cooler'

it('returns 404 if cpu cooler was not found', async () => {
  await request(app)
    .patch(`/api/parts/cpucooler/${mongoose.Types.ObjectId().toHexString()}`)
    .set('Cookie', global.signin())
    .send({
      name: 'randomname',
    })
    .expect(404)
})

it('updates cpu cooler if provided valid arguments', async () => {
  const cpuCooler = CpuCooler.build({
    name: 'cpuCooler',
  })

  await cpuCooler.save()

  const { _id: id } = cpuCooler

  await request(app)
    .patch(`/api/parts/cpucooler/${id}`)
    .set('Cookie', global.signin())
    .send({
      name: 'updatedcpucoolername',
    })
    .expect(200)

  let updatedCpuCooler = await CpuCooler.findById(id)

  expect(updatedCpuCooler!.name).toEqual('updatedcpucoolername')

  await request(app)
    .patch(`/api/parts/cpucooler/${id}`)
    .set('Cookie', global.signin())
    .send({
      cpuSocket: ['cpuSocket1', 'cpuSocket2'],
    })
    .expect(200)

  updatedCpuCooler = await CpuCooler.findById(id).populate('cpuSocket')
  //@ts-ignore
  expect(updatedCpuCooler.cpuSocket.length).toEqual(2)

  await request(app)
    .patch(`/api/parts/cpucooler/${id}`)
    .set('Cookie', global.signin())
    .send({
      fanRpm: {
        min: 1,
        max: 2,
      },
    })
    .expect(200)

  updatedCpuCooler = await CpuCooler.findById(id)

  expect(updatedCpuCooler!.fanRpm.min).toEqual(1)
  expect(updatedCpuCooler!.fanRpm.max).toEqual(2)

  await request(app)
    .patch(`/api/parts/cpucooler/${id}`)
    .set('Cookie', global.signin())
    .send({
      noiceLevel: {
        min: 1,
        max: 2,
      },
    })
    .expect(200)

  updatedCpuCooler = await CpuCooler.findById(id)

  expect(updatedCpuCooler!.noiceLevel.min).toEqual(1)
  expect(updatedCpuCooler!.noiceLevel.max).toEqual(2)

  await request(app)
    .patch(`/api/parts/cpucooler/${id}`)
    .set('Cookie', global.signin())
    .send({
      bearing: 'bearing',
    })
    .expect(200)

  updatedCpuCooler = await CpuCooler.findById(id)

  expect(updatedCpuCooler!.bearing).toEqual('bearing')

  await request(app)
    .patch(`/api/parts/cpucooler/${id}`)
    .set('Cookie', global.signin())
    .send({
      waterCooled: false,
    })
    .expect(200)

  updatedCpuCooler = await CpuCooler.findById(id)

  expect(updatedCpuCooler!.waterCooled).toEqual(false)

  await request(app)
    .patch(`/api/parts/cpucooler/${id}`)
    .set('Cookie', global.signin())
    .send({
      fanless: false,
    })
    .expect(200)

  updatedCpuCooler = await CpuCooler.findById(id)

  expect(updatedCpuCooler!.fanless).toEqual(false)

  await request(app)
    .patch(`/api/parts/cpucooler/${id}`)
    .set('Cookie', global.signin())
    .send({
      publish: false,
    })
    .expect(200)

  updatedCpuCooler = await CpuCooler.findById(id)

  expect(updatedCpuCooler!.publish).toEqual(false)

  await request(app)
    .patch(`/api/parts/cpucooler/${id}`)
    .set('Cookie', global.signin())
    .send({
      manufacturer: {
        name: 'manname',
        info: 'randominfo',
      },
    })
    .expect(200)

  updatedCpuCooler = await CpuCooler.findById(id).populate('manufacturer')

  expect(updatedCpuCooler!.manufacturer.name).toEqual('manname')
  expect(updatedCpuCooler!.manufacturer.info).toEqual('randominfo')

  await request(app)
    .patch(`/api/parts/cpucooler/${id}`)
    .set('Cookie', global.signin())
    .send({
      itemCode: ['qweqweq'],
    })
    .expect(200)

  updatedCpuCooler = await CpuCooler.findById(id).populate('itemCode')

  expect(updatedCpuCooler!.itemCode.length).toEqual(1)

  await request(app)
    .patch(`/api/parts/cpucooler/${id}`)
    .set('Cookie', global.signin())
    .send({
      itemImages: [{ name: 'wewe', url: 'qweqe' }],
    })
    .expect(200)

  updatedCpuCooler = await CpuCooler.findById(id).populate('itemImages')

  expect(updatedCpuCooler!.itemImages.length).toEqual(1)

  await request(app)
    .patch(`/api/parts/cpucooler/${id}`)
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

  updatedCpuCooler = await CpuCooler.findById(id)
  expect(updatedCpuCooler!.measurements.length).toEqual(1)
  expect(updatedCpuCooler!.measurements.width).toEqual(2)
  expect(updatedCpuCooler!.measurements.height).toEqual(3)
  expect(updatedCpuCooler!.measurements.dimension).toEqual('dimension')
})
