import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../../app'
import { CpuCooler } from '../../../models/cpu-cooler'
import { Items } from '../../../models/items'

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
  const itemInfo = Items.build({
    name: mongoose.Types.ObjectId().toHexString().slice(0, 5),
  })

  await itemInfo.save()

  const cpuCooler = CpuCooler.build({
    itemInfo,
  })
  await cpuCooler.save()

  await cpuCooler.save()

  const { _id: id } = cpuCooler

  await request(app)
    .patch(`/api/parts/cpucooler/${id}`)
    .set('Cookie', global.signin())
    .send({
      name: 'updatedcpucoolername',
    })
    .expect(200)

  let updatedCpuCooler = await CpuCooler.findById(id).populate('itemInfo')

  expect(updatedCpuCooler!.itemInfo.name).toEqual('updatedcpucoolername')

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
    .populate({
      path: 'itemInfo',
      model: 'Items',
      populate: [
        {
          path: 'manufacturer',
          model: 'Manufacturer',
        },
        {
          path: 'itemCode',
          model: 'ItemCode',
        },
        {
          path: 'itemImages',
          model: 'Images',
        },
        {
          path: 'itemType',
          model: 'ItemType',
        },
      ],
    })
    .exec()

  expect(updatedCpuCooler!.itemInfo.publish).toEqual(false)

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

  updatedCpuCooler = await CpuCooler.findById(id)
    .populate({
      path: 'itemInfo',
      model: 'Items',
      populate: [
        {
          path: 'manufacturer',
          model: 'Manufacturer',
        },
        {
          path: 'itemCode',
          model: 'ItemCode',
        },
        {
          path: 'itemImages',
          model: 'Images',
        },
        {
          path: 'itemType',
          model: 'ItemType',
        },
      ],
    })
    .exec()

  expect(updatedCpuCooler!.itemInfo.manufacturer.name).toEqual('manname')
  expect(updatedCpuCooler!.itemInfo.manufacturer.info).toEqual('randominfo')

  await request(app)
    .patch(`/api/parts/cpucooler/${id}`)
    .set('Cookie', global.signin())
    .send({
      itemCode: ['qweqweq'],
    })
    .expect(200)

  updatedCpuCooler = await CpuCooler.findById(id)
    .populate({
      path: 'itemInfo',
      model: 'Items',
      populate: [
        {
          path: 'manufacturer',
          model: 'Manufacturer',
        },
        {
          path: 'itemCode',
          model: 'ItemCode',
        },
        {
          path: 'itemImages',
          model: 'Images',
        },
        {
          path: 'itemType',
          model: 'ItemType',
        },
      ],
    })
    .exec()

  expect(updatedCpuCooler!.itemInfo.itemCode.length).toEqual(1)

  await request(app)
    .patch(`/api/parts/cpucooler/${id}`)
    .set('Cookie', global.signin())
    .send({
      itemImages: [{ name: 'wewe', url: 'qweqe' }],
    })
    .expect(200)

  updatedCpuCooler = await CpuCooler.findById(id)
    .populate({
      path: 'itemInfo',
      model: 'Items',
      populate: [
        {
          path: 'manufacturer',
          model: 'Manufacturer',
        },
        {
          path: 'itemCode',
          model: 'ItemCode',
        },
        {
          path: 'itemImages',
          model: 'Images',
        },
        {
          path: 'itemType',
          model: 'ItemType',
        },
      ],
    })
    .exec()

  expect(updatedCpuCooler!.itemInfo.itemImages.length).toEqual(1)

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
    .populate({
      path: 'itemInfo',
      model: 'Items',
      populate: [
        {
          path: 'manufacturer',
          model: 'Manufacturer',
        },
        {
          path: 'itemCode',
          model: 'ItemCode',
        },
        {
          path: 'itemImages',
          model: 'Images',
        },
        {
          path: 'itemType',
          model: 'ItemType',
        },
      ],
    })
    .exec()

  expect(updatedCpuCooler!.itemInfo.measurements.length).toEqual(1)
  expect(updatedCpuCooler!.itemInfo.measurements.width).toEqual(2)
  expect(updatedCpuCooler!.itemInfo.measurements.height).toEqual(3)
  expect(updatedCpuCooler!.itemInfo.measurements.dimension).toEqual('dimension')
})
