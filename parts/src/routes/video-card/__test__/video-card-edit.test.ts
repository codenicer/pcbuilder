import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../../app'
import { Items } from '../../../models/items'
import { VideoCard } from '../../../models/video-card'

it('returns 404 if videocard was not found', async () => {
  await request(app)
    .patch(`/api/parts/videocard/${mongoose.Types.ObjectId().toHexString()}`)
    .set('Cookie', global.signin())
    .send({
      name: 'randomname',
    })
    .expect(404)
})

it('updates videocard if provided valid arguments', async () => {
  const itemInfo = Items.build({
    name: mongoose.Types.ObjectId().toHexString().slice(0, 5),
  })
  await itemInfo.save()

  const videoCard = VideoCard.build({
    itemInfo,
  })

  await videoCard.save()

  const { _id: id } = videoCard

  await request(app)
    .patch(`/api/parts/videocard/${id}`)
    .set('Cookie', global.signin())
    .send({
      name: 'updatedvideocardname',
    })
    .expect(200)

  let updateVideoCard = await VideoCard.findById(id)
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

  expect(updateVideoCard!.itemInfo.name).toEqual('updatedvideocardname')

  await request(app)
    .patch(`/api/parts/videocard/${id}`)
    .set('Cookie', global.signin())
    .send({
      chipset: 'chipset',
    })
    .expect(200)

  updateVideoCard = await VideoCard.findById(id).populate('chipset')

  //@ts-ignore
  expect(updateVideoCard.chipset.name).toEqual('chipset')

  await request(app)
    .patch(`/api/parts/videocard/${id}`)
    .set('Cookie', global.signin())
    .send({
      memoryType: 'memoryType',
    })
    .expect(200)

  updateVideoCard = await VideoCard.findById(id).populate('memoryType')

  //@ts-ignore
  expect(updateVideoCard.memoryType.name).toEqual('memoryType')

  await request(app)
    .patch(`/api/parts/videocard/${id}`)
    .set('Cookie', global.signin())
    .send({
      interfaces: 'interfaces',
    })
    .expect(200)

  updateVideoCard = await VideoCard.findById(id).populate('interfaces')

  //@ts-ignore
  expect(updateVideoCard.interfaces.name).toEqual('interfaces')

  await request(app)
    .patch(`/api/parts/videocard/${id}`)
    .set('Cookie', global.signin())
    .send({
      sliCrossfireType: 'sliCrossfireType',
    })
    .expect(200)

  updateVideoCard = await VideoCard.findById(id).populate('sliCrossfireType')

  //@ts-ignore
  expect(updateVideoCard.sliCrossfireType.name).toEqual('sliCrossfireType')

  await request(app)
    .patch(`/api/parts/videocard/${id}`)
    .set('Cookie', global.signin())
    .send({
      ports: [
        { name: 'port1', count: 2 },
        { name: 'port2', count: 2 },
      ],
    })
    .expect(200)

  updateVideoCard = await VideoCard.findById(id).populate('ports')

  //@ts-ignore
  expect(updateVideoCard.ports.length).toEqual(2)

  await request(app)
    .patch(`/api/parts/videocard/${id}`)
    .set('Cookie', global.signin())
    .send({
      frameSync: 'frameSync',
    })
    .expect(200)

  updateVideoCard = await VideoCard.findById(id)

  expect(updateVideoCard!.frameSync).toEqual('frameSync')

  await request(app)
    .patch(`/api/parts/videocard/${id}`)
    .set('Cookie', global.signin())
    .send({
      frameSync: 'frameSync',
    })
    .expect(200)

  updateVideoCard = await VideoCard.findById(id)

  expect(updateVideoCard!.frameSync).toEqual('frameSync')

  await request(app)
    .patch(`/api/parts/videocard/${id}`)
    .set('Cookie', global.signin())
    .send({
      cooling: 'cooling',
    })
    .expect(200)

  updateVideoCard = await VideoCard.findById(id)

  expect(updateVideoCard!.cooling).toEqual('cooling')

  await request(app)
    .patch(`/api/parts/videocard/${id}`)
    .set('Cookie', global.signin())
    .send({
      externalPower: 'externalPower',
    })
    .expect(200)

  updateVideoCard = await VideoCard.findById(id)

  expect(updateVideoCard!.externalPower).toEqual('externalPower')

  await request(app)
    .patch(`/api/parts/videocard/${id}`)
    .set('Cookie', global.signin())
    .send({
      memory: 1,
    })
    .expect(200)

  updateVideoCard = await VideoCard.findById(id)

  expect(updateVideoCard!.memory).toEqual(1)

  await request(app)
    .patch(`/api/parts/videocard/${id}`)
    .set('Cookie', global.signin())
    .send({
      coreClock: 1,
    })
    .expect(200)

  updateVideoCard = await VideoCard.findById(id)

  expect(updateVideoCard!.coreClock).toEqual(1)

  await request(app)
    .patch(`/api/parts/videocard/${id}`)
    .set('Cookie', global.signin())
    .send({
      boostClock: 1,
    })
    .expect(200)

  updateVideoCard = await VideoCard.findById(id)

  expect(updateVideoCard!.boostClock).toEqual(1)

  await request(app)
    .patch(`/api/parts/videocard/${id}`)
    .set('Cookie', global.signin())
    .send({
      tdp: 1,
    })
    .expect(200)

  updateVideoCard = await VideoCard.findById(id)

  expect(updateVideoCard!.tdp).toEqual(1)

  await request(app)
    .patch(`/api/parts/videocard/${id}`)
    .set('Cookie', global.signin())
    .send({
      effectiveMemoryClock: 1,
    })
    .expect(200)

  updateVideoCard = await VideoCard.findById(id)

  expect(updateVideoCard!.effectiveMemoryClock).toEqual(1)

  await request(app)
    .patch(`/api/parts/videocard/${id}`)
    .set('Cookie', global.signin())
    .send({
      expansionSlotWidth: 1,
    })
    .expect(200)

  updateVideoCard = await VideoCard.findById(id)

  expect(updateVideoCard!.expansionSlotWidth).toEqual(1)

  await request(app)
    .patch(`/api/parts/videocard/${id}`)
    .set('Cookie', global.signin())
    .send({
      publish: true,
    })
    .expect(200)

  updateVideoCard = await VideoCard.findById(id)
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

  expect(updateVideoCard!.itemInfo.publish).toEqual(true)

  await request(app)
    .patch(`/api/parts/videocard/${id}`)
    .set('Cookie', global.signin())
    .send({
      manufacturer: {
        name: 'manname',
        info: 'randominfo',
      },
    })
    .expect(200)

  updateVideoCard = await VideoCard.findById(id)
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

  expect(updateVideoCard!.itemInfo.manufacturer.name).toEqual('manname')
  expect(updateVideoCard!.itemInfo.manufacturer.info).toEqual('randominfo')

  await request(app)
    .patch(`/api/parts/videocard/${id}`)
    .set('Cookie', global.signin())
    .send({
      itemCode: ['qweqweq'],
    })
    .expect(200)

  updateVideoCard = await VideoCard.findById(id)
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

  expect(updateVideoCard!.itemInfo.itemCode.length).toEqual(1)

  await request(app)
    .patch(`/api/parts/videocard/${id}`)
    .set('Cookie', global.signin())
    .send({
      itemImages: [{ name: 'wewe', url: 'qweqe' }],
    })
    .expect(200)

  updateVideoCard = await VideoCard.findById(id)
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

  expect(updateVideoCard!.itemInfo.itemImages.length).toEqual(1)

  await request(app)
    .patch(`/api/parts/videocard/${id}`)
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
  updateVideoCard = await VideoCard.findById(id)
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

  expect(updateVideoCard!.itemInfo.measurements.length).toEqual(1)
  expect(updateVideoCard!.itemInfo.measurements.width).toEqual(2)
  expect(updateVideoCard!.itemInfo.measurements.height).toEqual(3)
  expect(updateVideoCard!.itemInfo.measurements.dimension).toEqual('dimension')
})
