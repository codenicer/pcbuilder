import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../../app'
import { MotherBoard } from '../../../models/motherboard'
// import { natsWrapper } from '../../nats-wrapper';

it('returns 404 if motherboard was not found', async () => {
  await request(app)
    .patch(`/api/parts/motherboard/${mongoose.Types.ObjectId().toHexString()}`)
    .set('Cookie', global.signin())
    .send({
      name: 'randomname',
    })
    .expect(404)
})

it('updates motherboard if provided valid arguments', async () => {
  const motherboard = MotherBoard.build({
    name: 'motherboardname',
  })

  await motherboard.save()

  const { _id: id } = motherboard

  await request(app)
    .patch(`/api/parts/motherboard/${id}`)
    .set('Cookie', global.signin())
    .send({
      name: 'updatedmotherboardname',
    })
    .expect(200)

  let updatedMotherboard = await MotherBoard.findById(id)
  expect(updatedMotherboard!.name).toEqual('updatedmotherboardname')

  await request(app)
    .patch(`/api/parts/motherboard/${id}`)
    .set('Cookie', global.signin())
    .send({
      cpuSocket: 'cpusocket',
    })
    .expect(200)

  updatedMotherboard = await MotherBoard.findById(id).populate('cpuSocket')

  //@ts-ignore
  expect(updatedMotherboard.cpuSocket.name).toEqual('cpusocket')

  await request(app)
    .patch(`/api/parts/motherboard/${id}`)
    .set('Cookie', global.signin())
    .send({
      formFactor: 'formFactor',
    })
    .expect(200)

  updatedMotherboard = await MotherBoard.findById(id).populate('formFactor')

  //@ts-ignore
  expect(updatedMotherboard.formFactor.name).toEqual('formFactor')

  await request(app)
    .patch(`/api/parts/motherboard/${id}`)
    .set('Cookie', global.signin())
    .send({
      chipset: 'chipset',
    })
    .expect(200)

  updatedMotherboard = await MotherBoard.findById(id).populate('chipset')

  //@ts-ignore
  expect(updatedMotherboard.chipset.name).toEqual('chipset')

  await request(app)
    .patch(`/api/parts/motherboard/${id}`)
    .set('Cookie', global.signin())
    .send({
      memoryType: 'memoryType',
    })
    .expect(200)

  updatedMotherboard = await MotherBoard.findById(id).populate('memoryType')

  //@ts-ignore
  expect(updatedMotherboard.memoryType.name).toEqual('memoryType')

  await request(app)
    .patch(`/api/parts/motherboard/${id}`)
    .set('Cookie', global.signin())
    .send({
      wirelessNetworking: 'wirelessNetworking',
    })
    .expect(200)

  updatedMotherboard = await MotherBoard.findById(id)

  //@ts-ignore
  expect(updatedMotherboard.wirelessNetworking).toEqual('wirelessNetworking')

  await request(app)
    .patch(`/api/parts/motherboard/${id}`)
    .set('Cookie', global.signin())
    .send({
      onBoardVideo: 'onBoardVideo',
    })
    .expect(200)

  updatedMotherboard = await MotherBoard.findById(id)

  //@ts-ignore
  expect(updatedMotherboard.onBoardVideo).toEqual('onBoardVideo')

  await request(app)
    .patch(`/api/parts/motherboard/${id}`)
    .set('Cookie', global.signin())
    .send({
      sliCrossFire: true,
    })
    .expect(200)

  updatedMotherboard = await MotherBoard.findById(id)

  //@ts-ignore
  expect(updatedMotherboard.sliCrossFire).toEqual(true)

  await request(app)
    .patch(`/api/parts/motherboard/${id}`)
    .set('Cookie', global.signin())
    .send({
      ramSlot: 8,
    })
    .expect(200)

  updatedMotherboard = await MotherBoard.findById(id)

  //@ts-ignore
  expect(updatedMotherboard.ramSlot).toEqual(8)

  await request(app)
    .patch(`/api/parts/motherboard/${id}`)
    .set('Cookie', global.signin())
    .send({
      onboardEthernet: 'onboardEthernet',
    })
    .expect(200)

  updatedMotherboard = await MotherBoard.findById(id)

  //@ts-ignore
  expect(updatedMotherboard.onboardEthernet).toEqual('onboardEthernet')

  await request(app)
    .patch(`/api/parts/motherboard/${id}`)
    .set('Cookie', global.signin())
    .send({
      supportEcc: true,
    })
    .expect(200)

  updatedMotherboard = await MotherBoard.findById(id)

  //@ts-ignore
  expect(updatedMotherboard.supportEcc).toEqual(true)

  await request(app)
    .patch(`/api/parts/motherboard/${id}`)
    .set('Cookie', global.signin())
    .send({
      raidSupport: true,
    })
    .expect(200)

  updatedMotherboard = await MotherBoard.findById(id)

  //@ts-ignore
  expect(updatedMotherboard.raidSupport).toEqual(true)

  await request(app)
    .patch(`/api/parts/motherboard/${id}`)
    .set('Cookie', global.signin())
    .send({
      publish: true,
    })
    .expect(200)

  updatedMotherboard = await MotherBoard.findById(id)

  //@ts-ignore
  expect(updatedMotherboard.publish).toEqual(true)

  await request(app)
    .patch(`/api/parts/motherboard/${id}`)
    .set('Cookie', global.signin())
    .send({
      memorySpeed: ['memorySpeed1', 'memorySpeed2'],
    })
    .expect(200)

  updatedMotherboard = await MotherBoard.findById(id).populate('memorySpeed')

  //@ts-ignore
  expect(updatedMotherboard.memorySpeed.length).toEqual(2)

  await request(app)
    .patch(`/api/parts/motherboard/${id}`)
    .set('Cookie', global.signin())
    .send({
      pcieSlots: [
        { name: 'pcieSlots1', count: 2 },
        { name: 'pcieSlots1', count: 2 },
      ],
    })
    .expect(200)

  updatedMotherboard = await MotherBoard.findById(id).populate('memorySpeed')

  //@ts-ignore
  expect(updatedMotherboard.pcieSlots.length).toEqual(2)

  await request(app)
    .patch(`/api/parts/motherboard/${id}`)
    .set('Cookie', global.signin())
    .send({
      usbSlots: [
        { name: 'usbSlots1', count: 2 },
        { name: 'usbSlots2', count: 2 },
      ],
    })
    .expect(200)

  updatedMotherboard = await MotherBoard.findById(id).populate('usbSlots')

  //@ts-ignore
  expect(updatedMotherboard.usbSlots.length).toEqual(2)

  await request(app)
    .patch(`/api/parts/motherboard/${id}`)
    .set('Cookie', global.signin())
    .send({
      sataSlots: [
        { name: 'sataSlots1', count: 2 },
        { name: 'sataSlots2', count: 2 },
      ],
    })
    .expect(200)

  updatedMotherboard = await MotherBoard.findById(id).populate('sataSlots')

  //@ts-ignore
  expect(updatedMotherboard.sataSlots.length).toEqual(2)

  await request(app)
    .patch(`/api/parts/motherBoard/${id}`)
    .set('Cookie', global.signin())
    .send({
      manufacturer: {
        name: 'manname',
        info: 'randominfo',
      },
    })
    .expect(200)

  updatedMotherboard = await MotherBoard.findById(id).populate('manufacturer')

  expect(updatedMotherboard!.manufacturer.name).toEqual('manname')
  expect(updatedMotherboard!.manufacturer.info).toEqual('randominfo')

  await request(app)
    .patch(`/api/parts/motherBoard/${id}`)
    .set('Cookie', global.signin())
    .send({
      itemCode: ['qweqwe'],
    })
    .expect(200)

  updatedMotherboard = await MotherBoard.findById(id).populate('itemCode')

  expect(updatedMotherboard!.itemCode.length).toEqual(1)

  await request(app)
    .patch(`/api/parts/motherBoard/${id}`)
    .set('Cookie', global.signin())
    .send({
      itemImages: [{ name: 'wewe', url: 'qweqe' }],
    })
    .expect(200)

  updatedMotherboard = await MotherBoard.findById(id).populate('itemImages')

  expect(updatedMotherboard!.itemImages.length).toEqual(1)

  await request(app)
    .patch(`/api/parts/motherBoard/${id}`)
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

  updatedMotherboard = await MotherBoard.findById(id)
  expect(updatedMotherboard!.measurements.length).toEqual(1)
  expect(updatedMotherboard!.measurements.width).toEqual(2)
  expect(updatedMotherboard!.measurements.height).toEqual(3)
  expect(updatedMotherboard!.measurements.dimension).toEqual('dimension')
})
