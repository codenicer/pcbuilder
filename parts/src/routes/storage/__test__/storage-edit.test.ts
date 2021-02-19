import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../../app'
import { Items } from '../../../models/items'
import { Storage } from '../../../models/storage'

it('returns 404 if storage was not found', async () => {
  await request(app)
    .patch(`/api/parts/storage/${mongoose.Types.ObjectId().toHexString()}`)
    .set('Cookie', global.signin())
    .send({
      name: 'randomname',
    })
    .expect(404)

  await request(app)
    .patch(`/api/parts/storage/`)
    .set('Cookie', global.signin())
    .send({
      name: 'randomname',
    })
    .expect(404)
})

it('updates storage if provided valid arguments', async () => {
  const itemInfo = Items.build({
    name: mongoose.Types.ObjectId().toHexString().slice(0, 5),
  })

  await itemInfo.save()

  const storage = Storage.build({
    itemInfo,
  })

  await storage.save()

  const { _id: id } = storage

  await request(app)
    .patch(`/api/parts/storage/${id}`)
    .set('Cookie', global.signin())
    .send({
      name: 'updatedstoragename',
    })
    .expect(200)

  let updatedStorage = await Storage.findById(id).populate('itemInfo')

  expect(updatedStorage!.itemInfo.name).toEqual('updatedstoragename')

  await request(app)
    .patch(`/api/parts/storage/${id}`)
    .set('Cookie', global.signin())
    .send({
      formFactor: 'formFactor',
    })
    .expect(200)

  updatedStorage = await Storage.findById(id).populate('formFactor')

  expect(updatedStorage!.formFactor.name).toEqual('formFactor')

  await request(app)
    .patch(`/api/parts/storage/${id}`)
    .set('Cookie', global.signin())
    .send({
      interfaces: 'interfaces',
    })
    .expect(200)

  updatedStorage = await Storage.findById(id).populate('interfaces')

  expect(updatedStorage!.interfaces.name).toEqual('interfaces')

  await request(app)
    .patch(`/api/parts/storage/${id}`)
    .set('Cookie', global.signin())
    .send({
      capacity: 1,
    })
    .expect(200)

  updatedStorage = await Storage.findById(id)

  expect(updatedStorage!.capacity).toEqual(1)

  await request(app)
    .patch(`/api/parts/storage/${id}`)
    .set('Cookie', global.signin())
    .send({
      pricePerGb: 1,
    })
    .expect(200)

  updatedStorage = await Storage.findById(id)

  expect(updatedStorage!.pricePerGb).toEqual(1)

  await request(app)
    .patch(`/api/parts/storage/${id}`)
    .set('Cookie', global.signin())
    .send({
      type: 'type',
    })
    .expect(200)

  updatedStorage = await Storage.findById(id)

  expect(updatedStorage!.type).toEqual('type')

  await request(app)
    .patch(`/api/parts/storage/${id}`)
    .set('Cookie', global.signin())
    .send({
      isNvme: false,
    })
    .expect(200)

  updatedStorage = await Storage.findById(id)

  expect(updatedStorage!.isNvme).toEqual(false)

  await request(app)
    .patch(`/api/parts/storage/${id}`)
    .set('Cookie', global.signin())
    .send({
      publish: true,
    })
    .expect(200)

  updatedStorage = await Storage.findById(id)
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

  expect(updatedStorage!.itemInfo.publish).toEqual(true)

  await request(app)
    .patch(`/api/parts/storage/${id}`)
    .set('Cookie', global.signin())
    .send({
      manufacturer: {
        name: 'manname',
        info: 'randominfo',
      },
    })
    .expect(200)

  updatedStorage = await Storage.findById(id)
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

  expect(updatedStorage!.itemInfo.manufacturer.name).toEqual('manname')
  expect(updatedStorage!.itemInfo.manufacturer.info).toEqual('randominfo')

  await request(app)
    .patch(`/api/parts/storage/${id}`)
    .set('Cookie', global.signin())
    .send({
      itemCode: ['qweqweq'],
    })
    .expect(200)

  updatedStorage = await Storage.findById(id)
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

  expect(updatedStorage!.itemInfo.itemCode.length).toEqual(1)

  await request(app)
    .patch(`/api/parts/storage/${id}`)
    .set('Cookie', global.signin())
    .send({
      itemImages: [{ name: 'wewe', url: 'qweqe' }],
    })
    .expect(200)

  updatedStorage = await Storage.findById(id)
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

  expect(updatedStorage!.itemInfo.itemImages.length).toEqual(1)

  await request(app)
    .patch(`/api/parts/storage/${id}`)
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

  updatedStorage = await Storage.findById(id)
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

  expect(updatedStorage!.itemInfo.measurements.length).toEqual(1)
  expect(updatedStorage!.itemInfo.measurements.width).toEqual(2)
  expect(updatedStorage!.itemInfo.measurements.height).toEqual(3)
  expect(updatedStorage!.itemInfo.measurements.dimension).toEqual('dimension')
})
