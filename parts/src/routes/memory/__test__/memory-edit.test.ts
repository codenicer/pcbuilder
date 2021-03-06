import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../../app'
import { Items } from '../../../models/items'
import { Memory } from '../../../models/memory'
// import { natsWrapper } from '../../nats-wrapper';

it('returns 404 if memory was not found', async () => {
  await request(app)
    .patch(`/api/parts/memory/${mongoose.Types.ObjectId().toHexString()}`)
    .set('Cookie', global.signin())
    .send({
      name: 'randomname',
    })
    .expect(404)
})

it('updates memory if provided valid arguments', async () => {
  const itemInfo = Items.build({
    name: mongoose.Types.ObjectId().toHexString().slice(0, 5),
  })

  await itemInfo.save()
  const memory = Memory.build({
    itemInfo,
  })
  await memory.save()

  const { _id: id } = memory

  await request(app)
    .patch(`/api/parts/memory/${id}`)
    .set('Cookie', global.signin())
    .send({
      name: 'updatedmemoryname',
    })
    .expect(200)

  let updateMemory = await Memory.findById(id).populate('itemInfo')

  expect(updateMemory!.itemInfo.name).toEqual('updatedmemoryname')

  await request(app)
    .patch(`/api/parts/memory/${id}`)
    .set('Cookie', global.signin())
    .send({
      memorySpeed: 'memorySpeed',
    })
    .expect(200)

  updateMemory = await Memory.findById(id).populate('memorySpeed')

  //@ts-ignore
  expect(updateMemory.memorySpeed.name).toEqual('memorySpeed')

  await request(app)
    .patch(`/api/parts/memory/${id}`)
    .set('Cookie', global.signin())
    .send({
      memoryType: 'memoryType',
    })
    .expect(200)

  updateMemory = await Memory.findById(id).populate('memoryType')

  //@ts-ignore
  expect(updateMemory.memoryType.name).toEqual('memoryType')

  await request(app)
    .patch(`/api/parts/memory/${id}`)
    .set('Cookie', global.signin())
    .send({
      module: 'module',
    })
    .expect(200)

  updateMemory = await Memory.findById(id)

  //@ts-ignore
  expect(updateMemory.module).toEqual('module')

  await request(app)
    .patch(`/api/parts/memory/${id}`)
    .set('Cookie', global.signin())
    .send({
      timing: 'timing',
    })
    .expect(200)

  updateMemory = await Memory.findById(id)

  //@ts-ignore
  expect(updateMemory.timing).toEqual('timing')

  await request(app)
    .patch(`/api/parts/memory/${id}`)
    .set('Cookie', global.signin())
    .send({
      casLatency: 8,
    })
    .expect(200)

  updateMemory = await Memory.findById(id)

  //@ts-ignore
  expect(updateMemory.casLatency).toEqual(8)

  await request(app)
    .patch(`/api/parts/memory/${id}`)
    .set('Cookie', global.signin())
    .send({
      pricePerGb: 8,
    })
    .expect(200)

  updateMemory = await Memory.findById(id)

  //@ts-ignore
  expect(updateMemory.pricePerGb).toEqual(8)

  await request(app)
    .patch(`/api/parts/memory/${id}`)
    .set('Cookie', global.signin())
    .send({
      voltage: 8,
    })
    .expect(200)

  updateMemory = await Memory.findById(id)

  //@ts-ignore
  expect(updateMemory.voltage).toEqual(8)

  await request(app)
    .patch(`/api/parts/memory/${id}`)
    .set('Cookie', global.signin())
    .send({
      heatSpreader: false,
    })
    .expect(200)

  updateMemory = await Memory.findById(id)

  //@ts-ignore
  expect(updateMemory.heatSpreader).toEqual(false)

  await request(app)
    .patch(`/api/parts/memory/${id}`)
    .set('Cookie', global.signin())
    .send({
      manufacturer: {
        name: 'manname',
        info: 'randominfo',
      },
    })
    .expect(200)

  updateMemory = await Memory.findById(id)
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

  expect(updateMemory!.itemInfo.manufacturer.name).toEqual('manname')
  expect(updateMemory!.itemInfo.manufacturer.info).toEqual('randominfo')

  await request(app)
    .patch(`/api/parts/memory/${id}`)
    .set('Cookie', global.signin())
    .send({
      itemCode: ['qweqwe'],
    })
    .expect(200)

  updateMemory = await Memory.findById(id)
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
  expect(updateMemory!.itemInfo.itemCode.length).toEqual(1)

  await request(app)
    .patch(`/api/parts/memory/${id}`)
    .set('Cookie', global.signin())
    .send({
      itemImages: [{ name: 'wewe', url: 'qweqe' }],
    })
    .expect(200)
  updateMemory = await Memory.findById(id)
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
  expect(updateMemory!.itemInfo.itemImages.length).toEqual(1)

  await request(app)
    .patch(`/api/parts/memory/${id}`)
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
  updateMemory = await Memory.findById(id)
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
  expect(updateMemory!.itemInfo.measurements.length).toEqual(1)
  expect(updateMemory!.itemInfo.measurements.width).toEqual(2)
  expect(updateMemory!.itemInfo.measurements.height).toEqual(3)
  expect(updateMemory!.itemInfo.measurements.dimension).toEqual('dimension')
})
