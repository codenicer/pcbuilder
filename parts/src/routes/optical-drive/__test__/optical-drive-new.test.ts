import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../../app'
import { Items } from '../../../models/items'
import { OpticalDrive } from '../../../models/optical-drive'

it('returns 400 with invalid optical drive arguments', async () => {
  await request(app)
    .post('/api/parts/opticaldrive')
    .set('Cookie', global.signin())
    .send({
      name: 1,
    })
    .expect(400)

  await request(app)
    .post('/api/parts/opticaldrive')
    .set('Cookie', global.signin())
    .send({
      name: 'opticaldrivename',
      bufferCache: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/opticaldrive')
    .set('Cookie', global.signin())
    .send({
      name: 'opticaldrivename',
      bdRomSpeed: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/opticaldrive')
    .set('Cookie', global.signin())
    .send({
      name: 'opticaldrivename',
      dvdRomSpeed: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/opticaldrive')
    .set('Cookie', global.signin())
    .send({
      name: 'opticaldrivename',
      cdRomSpeed: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/opticaldrive')
    .set('Cookie', global.signin())
    .send({
      name: 'opticaldrivename',
      dvdPositiveRDualLayerSpeed: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/opticaldrive')
    .set('Cookie', global.signin())
    .send({
      name: 'opticaldrivename',
      dvdPositiveRSpeed: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/opticaldrive')
    .set('Cookie', global.signin())
    .send({
      name: 'opticaldrivename',
      dvdPositiveRWSpeed: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/opticaldrive')
    .set('Cookie', global.signin())
    .send({
      name: 'opticaldrivename',
      dvdNegativeRSpeed: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/opticaldrive')
    .set('Cookie', global.signin())
    .send({
      name: 'opticaldrivename',
      dvdNegativeRAMSpeed: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/opticaldrive')
    .set('Cookie', global.signin())
    .send({
      name: 'opticaldrivename',
      dvdNegativeRWSpeed: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/opticaldrive')
    .set('Cookie', global.signin())
    .send({
      name: 'opticaldrivename',
      cdNegativeRSpeed: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/opticaldrive')
    .set('Cookie', global.signin())
    .send({
      name: 'opticaldrivename',
      cdNegativeRWSpeed: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/opticaldrive')
    .set('Cookie', global.signin())
    .send({
      name: 'opticaldrivename',
      interfaces: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/opticaldrive')
    .set('Cookie', global.signin())
    .send({
      name: 'opticaldrivename',
      formFactor: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/opticaldrive')
    .set('Cookie', global.signin())
    .send({
      name: 'opticaldrivename',
      manufacturer: {},
    })
    .expect(400)

  await request(app)
    .post('/api/parts/opticaldrive')
    .set('Cookie', global.signin())
    .send({
      name: 'opticaldrivename',
      itemCode: 123,
    })
    .expect(400)

  await request(app)
    .post('/api/parts/opticaldrive')
    .set('Cookie', global.signin())
    .send({
      name: 'opticaldrivename',
      itemImages: [],
    })
    .expect(400)

  await request(app)
    .post('/api/parts/opticaldrive')
    .set('Cookie', global.signin())
    .send({
      name: 'opticaldrivename',
      measurements: {
        length: 1,
        height: 2,
        width: 'qweqwe',
        dimension: 'qweqwe',
      },
    })
    .expect(400)
})

it('dont create duplicate optical drive name', async () => {
  const itemInfo = Items.build({
    name: 'opticalDrivename',
  })

  await itemInfo.save()

  const opticalDrive = OpticalDrive.build({
    itemInfo,
  })
  await opticalDrive.save()

  const res = await request(app)
    .post('/api/parts/opticaldrive')
    .set('Cookie', global.signin())
    .send({
      name: 'opticalDrivename',
    })

  expect(res.body.errors[0].message).toEqual('Name is already exist')
})

it('create new optical drive if provided valid argument', async () => {
  await request(app)
    .post('/api/parts/opticaldrive')
    .set('Cookie', global.signin())
    .send({
      name: 'opticalDrive',
    })

  expect((await OpticalDrive.find()).length).toEqual(1)
})
