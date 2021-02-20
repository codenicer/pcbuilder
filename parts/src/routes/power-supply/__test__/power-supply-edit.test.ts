import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../../app'
import { Items } from '../../../models/items'
import { PowerSupply } from '../../../models/power-supply'

it('returns 404 if power supply was not found', async () => {
  await request(app)
    .patch(`/api/parts/powersupply/${mongoose.Types.ObjectId().toHexString()}`)
    .set('Cookie', global.signin())
    .send({
      name: 'randomname',
    })
    .expect(404)
})

it('updates power supply if provided valid arguments', async () => {
  const itemInfo = Items.build({
    name: 'qweqweqweqweq',
  })

  await itemInfo.save()
  const powerSupply = PowerSupply.build({
    itemInfo,
  })
  await powerSupply.save()

  const { _id: id } = powerSupply

  await request(app)
    .patch(`/api/parts/powersupply/${id}`)
    .set('Cookie', global.signin())
    .send({
      name: 'updatedpowersupplyname',
    })
    .expect(200)

  let updatedPowersupply = await PowerSupply.findById(id).populate('itemInfo')

  expect(updatedPowersupply!.itemInfo.name).toEqual('updatedpowersupplyname')

  await request(app)
    .patch(`/api/parts/powersupply/${id}`)
    .set('Cookie', global.signin())
    .send({
      formFactor: 'formFactor',
    })
    .expect(200)

  updatedPowersupply = await PowerSupply.findById(id).populate('formFactor')
  //@ts-ignore
  expect(updatedPowersupply.formFactor.name).toEqual('formFactor')

  await request(app)
    .patch(`/api/parts/powersupply/${id}`)
    .set('Cookie', global.signin())
    .send({
      psuConnectors: [
        { name: 'psuConnectors1', count: 1 },
        { name: 'psuConnectors2', count: 2 },
      ],
    })
    .expect(200)

  updatedPowersupply = await PowerSupply.findById(id).populate('psuConnectors')
  //@ts-ignore
  expect(updatedPowersupply.psuConnectors.length).toEqual(2)

  await request(app)
    .patch(`/api/parts/powersupply/${id}`)
    .set('Cookie', global.signin())
    .send({
      efficiencyRating: 'efficiencyRating',
    })
    .expect(200)

  updatedPowersupply = await PowerSupply.findById(id)
  //@ts-ignore
  expect(updatedPowersupply.efficiencyRating).toEqual('efficiencyRating')

  await request(app)
    .patch(`/api/parts/powersupply/${id}`)
    .set('Cookie', global.signin())
    .send({
      modular: 'modular',
    })
    .expect(200)

  updatedPowersupply = await PowerSupply.findById(id)
  //@ts-ignore
  expect(updatedPowersupply.modular).toEqual('modular')

  await request(app)
    .patch(`/api/parts/powersupply/${id}`)
    .set('Cookie', global.signin())
    .send({
      type: 'type',
    })
    .expect(200)

  updatedPowersupply = await PowerSupply.findById(id)
  //@ts-ignore
  expect(updatedPowersupply.type).toEqual('type')

  await request(app)
    .patch(`/api/parts/powersupply/${id}`)
    .set('Cookie', global.signin())
    .send({
      wattage: 12,
    })
    .expect(200)

  updatedPowersupply = await PowerSupply.findById(id)
  //@ts-ignore
  expect(updatedPowersupply.wattage).toEqual(12)

  await request(app)
    .patch(`/api/parts/powersupply/${id}`)
    .set('Cookie', global.signin())
    .send({
      fanless: false,
    })
    .expect(200)

  updatedPowersupply = await PowerSupply.findById(id)
  //@ts-ignore
  expect(updatedPowersupply.fanless).toEqual(false)

  await request(app)
    .patch(`/api/parts/powersupply/${id}`)
    .set('Cookie', global.signin())
    .send({
      publish: false,
    })
    .expect(200)

  updatedPowersupply = await PowerSupply.findById(id).populate('itemInfo')

  expect(updatedPowersupply!.itemInfo.publish).toEqual(false)

  await request(app)
    .patch(`/api/parts/powersupply/${id}`)
    .set('Cookie', global.signin())
    .send({
      manufacturer: {
        name: 'manname',
        info: 'randominfo',
      },
    })
    .expect(200)

  updatedPowersupply = await PowerSupply.findById(id)
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

  expect(updatedPowersupply!.itemInfo.manufacturer.name).toEqual('manname')
  expect(updatedPowersupply!.itemInfo.manufacturer.info).toEqual('randominfo')

  await request(app)
    .patch(`/api/parts/powersupply/${id}`)
    .set('Cookie', global.signin())
    .send({
      itemCode: ['qweqweq'],
    })
    .expect(200)

  updatedPowersupply = await PowerSupply.findById(id)
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

  expect(updatedPowersupply!.itemInfo.itemCode.length).toEqual(1)

  await request(app)
    .patch(`/api/parts/powersupply/${id}`)
    .set('Cookie', global.signin())
    .send({
      itemImages: [{ name: 'wewe', url: 'qweqe' }],
    })
    .expect(200)

  updatedPowersupply = await PowerSupply.findById(id)
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

  expect(updatedPowersupply!.itemInfo.itemImages.length).toEqual(1)

  await request(app)
    .patch(`/api/parts/powersupply/${id}`)
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

  updatedPowersupply = await PowerSupply.findById(id)
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

  expect(updatedPowersupply!.itemInfo.measurements.length).toEqual(1)
  expect(updatedPowersupply!.itemInfo.measurements.width).toEqual(2)
  expect(updatedPowersupply!.itemInfo.measurements.height).toEqual(3)
  expect(updatedPowersupply!.itemInfo.measurements.dimension).toEqual(
    'dimension'
  )
})
