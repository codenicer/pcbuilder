import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../../app'
import { Items } from '../../../models/items'
import { MotherBoard } from '../../../models/motherboard'

// import { natsWrapper } from '../../nats-wrapper';

it('returns 400 with invalid motherboard arguments', async () => {
  await request(app)
    .post('/api/parts/motherboard')
    .set('Cookie', global.signin())
    .send({
      name: 1,
    })
    .expect(400)

  await request(app)
    .post('/api/parts/motherboard')
    .set('Cookie', global.signin())
    .send({
      name: 'motherboardname',
      cpuSocket: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/motherboard')
    .set('Cookie', global.signin())
    .send({
      name: 'motherboardname',
      formFactor: [],
    })
    .expect(400)

  await request(app)
    .post('/api/parts/motherboard')
    .set('Cookie', global.signin())
    .send({
      name: 'motherboardname',
      chipset: [],
    })
    .expect(400)

  await request(app)
    .post('/api/parts/motherboard')
    .set('Cookie', global.signin())
    .send({
      name: 'motherboardname',
      memoryType: [],
    })
    .expect(400)

  await request(app)
    .post('/api/parts/motherboard')
    .set('Cookie', global.signin())
    .send({
      name: 'motherboardname',
      memorySpeed: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/motherboard')
    .set('Cookie', global.signin())
    .send({
      name: 'motherboardname',
      pcieSlots: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/motherboard')
    .set('Cookie', global.signin())
    .send({
      name: 'motherboardname',
      usbSlots: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/motherboard')
    .set('Cookie', global.signin())
    .send({
      name: 'motherboardname',
      sataSlots: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/motherboard')
    .set('Cookie', global.signin())
    .send({
      name: 'motherboardname',
      wirelessNetworking: 1,
    })
    .expect(400)

  await request(app)
    .post('/api/parts/motherboard')
    .set('Cookie', global.signin())
    .send({
      name: 'motherboardname',
      onBoardVideo: 1,
    })
    .expect(400)

  await request(app)
    .post('/api/parts/motherboard')
    .set('Cookie', global.signin())
    .send({
      name: 'motherboardname',
      sliCrossFire: 'qwww',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/motherboard')
    .set('Cookie', global.signin())
    .send({
      name: 'motherboardname',
      ramSlot: 'qwe',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/motherboard')
    .set('Cookie', global.signin())
    .send({
      name: 'motherboardname',
      onboardEthernet: 1,
    })
    .expect(400)

  await request(app)
    .post('/api/parts/motherboard')
    .set('Cookie', global.signin())
    .send({
      name: 'motherboardname',
      supportEcc: 'qweqw',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/motherboard')
    .set('Cookie', global.signin())
    .send({
      name: 'motherboardname',
      raidSupport: 'qweqwe',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/motherboard')
    .set('Cookie', global.signin())
    .send({
      name: 'motherboardname',
      manufacturer: {},
    })
    .expect(400)

  await request(app)
    .post('/api/parts/motherboard')
    .set('Cookie', global.signin())
    .send({
      name: 'motherboardname',
      itemCode: [],
    })
    .expect(400)

  await request(app)
    .post('/api/parts/motherboard')
    .set('Cookie', global.signin())
    .send({
      name: 'motherboardname',
      itemImages: [],
    })
    .expect(400)

  await request(app)
    .post('/api/parts/motherboard')
    .set('Cookie', global.signin())
    .send({
      name: 'motherboardname',
      measurements: {
        length: 1,
        height: 2,
        width: 'qweqwe',
        dimension: 'qweqwe',
      },
    })
    .expect(400)
})

it('dont create duplicate motherboard name', async () => {
  const itemInfo = Items.build({
    name: 'motherboardname',
  })

  await itemInfo.save()

  const motherboard = MotherBoard.build({
    itemInfo,
  })

  await motherboard.save()

  const res = await request(app)
    .post('/api/parts/motherboard')
    .set('Cookie', global.signin())
    .send({
      name: 'motherboardname',
    })

  expect(res.body.errors[0].message).toEqual('Name is already exist')
})

it('create new motherboard if provided valid argument', async () => {
  await request(app)
    .post('/api/parts/motherboard')
    .set('Cookie', global.signin())
    .send({
      name: 'motherboardname',
    })

  expect((await MotherBoard.find()).length).toEqual(1)
})
