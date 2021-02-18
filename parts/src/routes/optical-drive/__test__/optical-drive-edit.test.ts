import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../../app'
import { OpticalDrive } from '../../../models/optical-drive'

it('returns 404 if optical drive was not found', async () => {
  await request(app)
    .patch(`/api/parts/opticaldrive/${mongoose.Types.ObjectId().toHexString()}`)
    .set('Cookie', global.signin())
    .send({
      name: 'randomname',
    })
    .expect(404)

  await request(app)
    .patch(`/api/parts/opticaldrive/`)
    .set('Cookie', global.signin())
    .send({
      name: 'randomname',
    })
    .expect(404)
})

it('updates optical drive if provided valid arguments', async () => {
  const opticalDrive = OpticalDrive.build({
    name: 'opticalDrive',
  })

  await opticalDrive.save()

  const { _id: id } = opticalDrive

  await request(app)
    .patch(`/api/parts/opticaldrive/${id}`)
    .set('Cookie', global.signin())
    .send({
      name: 'updatedopticaldrivename',
    })
    .expect(200)

  let updatedOpticalDrive = await OpticalDrive.findById(id)

  expect(updatedOpticalDrive!.name).toEqual('updatedopticaldrivename')

  await request(app)
    .patch(`/api/parts/opticaldrive/${id}`)
    .set('Cookie', global.signin())
    .send({
      interfaces: 'interfaces',
    })
    .expect(200)

  updatedOpticalDrive = await OpticalDrive.findById(id).populate('interfaces')

  expect(updatedOpticalDrive!.interfaces.name).toEqual('interfaces')

  await request(app)
    .patch(`/api/parts/opticaldrive/${id}`)
    .set('Cookie', global.signin())
    .send({
      formFactor: 'formFactor',
    })
    .expect(200)

  updatedOpticalDrive = await OpticalDrive.findById(id).populate('formFactor')

  //@ts-ignore
  expect(updatedOpticalDrive!.formFactor.name).toEqual('formFactor')

  await request(app)
    .patch(`/api/parts/opticaldrive/${id}`)
    .set('Cookie', global.signin())
    .send({
      bufferCache: 8,
    })
    .expect(200)

  updatedOpticalDrive = await OpticalDrive.findById(id)

  //@ts-ignore
  expect(updatedOpticalDrive!.bufferCache).toEqual(8)

  await request(app)
    .patch(`/api/parts/opticaldrive/${id}`)
    .set('Cookie', global.signin())
    .send({
      bdRomSpeed: 8,
    })
    .expect(200)

  updatedOpticalDrive = await OpticalDrive.findById(id)

  //@ts-ignore
  expect(updatedOpticalDrive!.bdRomSpeed).toEqual(8)

  await request(app)
    .patch(`/api/parts/opticaldrive/${id}`)
    .set('Cookie', global.signin())
    .send({
      dvdRomSpeed: 8,
    })
    .expect(200)

  updatedOpticalDrive = await OpticalDrive.findById(id)

  //@ts-ignore
  expect(updatedOpticalDrive!.dvdRomSpeed).toEqual(8)

  await request(app)
    .patch(`/api/parts/opticaldrive/${id}`)
    .set('Cookie', global.signin())
    .send({
      cdRomSpeed: 8,
    })
    .expect(200)

  updatedOpticalDrive = await OpticalDrive.findById(id)

  //@ts-ignore
  expect(updatedOpticalDrive!.cdRomSpeed).toEqual(8)

  await request(app)
    .patch(`/api/parts/opticaldrive/${id}`)
    .set('Cookie', global.signin())
    .send({
      dvdPositiveRDualLayerSpeed: 8,
    })
    .expect(200)

  updatedOpticalDrive = await OpticalDrive.findById(id)

  //@ts-ignore
  expect(updatedOpticalDrive!.dvdPositiveRDualLayerSpeed).toEqual(8)

  await request(app)
    .patch(`/api/parts/opticaldrive/${id}`)
    .set('Cookie', global.signin())
    .send({
      dvdPositiveRSpeed: 8,
    })
    .expect(200)

  updatedOpticalDrive = await OpticalDrive.findById(id)

  //@ts-ignore
  expect(updatedOpticalDrive!.dvdPositiveRSpeed).toEqual(8)

  await request(app)
    .patch(`/api/parts/opticaldrive/${id}`)
    .set('Cookie', global.signin())
    .send({
      dvdPositiveRWSpeed: 8,
    })
    .expect(200)

  updatedOpticalDrive = await OpticalDrive.findById(id)

  //@ts-ignore
  expect(updatedOpticalDrive!.dvdPositiveRWSpeed).toEqual(8)

  await request(app)
    .patch(`/api/parts/opticaldrive/${id}`)
    .set('Cookie', global.signin())
    .send({
      dvdNegativeRDualLayerSpeed: 8,
    })
    .expect(200)

  updatedOpticalDrive = await OpticalDrive.findById(id)

  //@ts-ignore
  expect(updatedOpticalDrive!.dvdNegativeRDualLayerSpeed).toEqual(8)

  await request(app)
    .patch(`/api/parts/opticaldrive/${id}`)
    .set('Cookie', global.signin())
    .send({
      dvdNegativeRSpeed: 8,
    })
    .expect(200)

  updatedOpticalDrive = await OpticalDrive.findById(id)

  //@ts-ignore
  expect(updatedOpticalDrive!.dvdNegativeRSpeed).toEqual(8)

  await request(app)
    .patch(`/api/parts/opticaldrive/${id}`)
    .set('Cookie', global.signin())
    .send({
      dvdNegativeRAMSpeed: 8,
    })
    .expect(200)

  updatedOpticalDrive = await OpticalDrive.findById(id)

  //@ts-ignore
  expect(updatedOpticalDrive!.dvdNegativeRAMSpeed).toEqual(8)

  await request(app)
    .patch(`/api/parts/opticaldrive/${id}`)
    .set('Cookie', global.signin())
    .send({
      cdNegativeRSpeed: 8,
    })
    .expect(200)

  updatedOpticalDrive = await OpticalDrive.findById(id)

  //@ts-ignore
  expect(updatedOpticalDrive!.cdNegativeRSpeed).toEqual(8)

  await request(app)
    .patch(`/api/parts/opticaldrive/${id}`)
    .set('Cookie', global.signin())
    .send({
      cdNegativeRWSpeed: 8,
    })
    .expect(200)

  updatedOpticalDrive = await OpticalDrive.findById(id)

  //@ts-ignore
  expect(updatedOpticalDrive!.cdNegativeRWSpeed).toEqual(8)

  await request(app)
    .patch(`/api/parts/opticaldrive/${id}`)
    .set('Cookie', global.signin())
    .send({
      manufacturer: {
        name: 'manname',
        info: 'randominfo',
      },
    })
    .expect(200)

  updatedOpticalDrive = await OpticalDrive.findById(id).populate('manufacturer')

  expect(updatedOpticalDrive!.manufacturer.name).toEqual('manname')
  expect(updatedOpticalDrive!.manufacturer.info).toEqual('randominfo')

  await request(app)
    .patch(`/api/parts/opticaldrive/${id}`)
    .set('Cookie', global.signin())
    .send({
      itemCode: ['qweqweq'],
    })
    .expect(200)

  updatedOpticalDrive = await OpticalDrive.findById(id).populate('itemCode')

  expect(updatedOpticalDrive!.itemCode.length).toEqual(1)

  await request(app)
    .patch(`/api/parts/opticaldrive/${id}`)
    .set('Cookie', global.signin())
    .send({
      itemImages: [{ name: 'wewe', url: 'qweqe' }],
    })
    .expect(200)

  updatedOpticalDrive = await OpticalDrive.findById(id).populate('itemImages')

  expect(updatedOpticalDrive!.itemImages.length).toEqual(1)

  await request(app)
    .patch(`/api/parts/opticaldrive/${id}`)
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

  updatedOpticalDrive = await OpticalDrive.findById(id)
  expect(updatedOpticalDrive!.measurements.length).toEqual(1)
  expect(updatedOpticalDrive!.measurements.width).toEqual(2)
  expect(updatedOpticalDrive!.measurements.height).toEqual(3)
  expect(updatedOpticalDrive!.measurements.dimension).toEqual('dimension')
})
