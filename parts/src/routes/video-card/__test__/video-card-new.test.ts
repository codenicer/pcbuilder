import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../../app'
import { VideoCard } from '../../../models/video-card'

// import { natsWrapper } from '../../nats-wrapper';

it('returns 400 with invalid videocard arguments', async () => {
  await request(app)
    .post('/api/parts/videocard')
    .set('Cookie', global.signin())
    .send({
      name: 1,
    })
    .expect(400)

  await request(app)
    .post('/api/parts/videocard')
    .set('Cookie', global.signin())
    .send({
      name: 'videocardname',
      chipset: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/videocard')
    .set('Cookie', global.signin())
    .send({
      name: 'videocardname',
      memoryType: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/videocard')
    .set('Cookie', global.signin())
    .send({
      name: 'videocardname',
      interfaces: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/videocard')
    .set('Cookie', global.signin())
    .send({
      name: 'videocardname',
      sliCrossfireType: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/videocard')
    .set('Cookie', global.signin())
    .send({
      name: 'videocardname',
      ports: [],
    })
    .expect(400)

  await request(app)
    .post('/api/parts/videocard')
    .set('Cookie', global.signin())
    .send({
      name: 'videocardname',
      frameSync: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/videocard')
    .set('Cookie', global.signin())
    .send({
      name: 'videocardname',
      cooling: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/videocard')
    .set('Cookie', global.signin())
    .send({
      name: 'videocardname',
      externalPower: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/videocard')
    .set('Cookie', global.signin())
    .send({
      name: 'videocardname',
      memory: 'qwe',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/videocard')
    .set('Cookie', global.signin())
    .send({
      name: 'videocardname',
      coreClock: 'qwe',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/videocard')
    .set('Cookie', global.signin())
    .send({
      name: 'videocardname',
      boostClock: 'qwww',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/videocard')
    .set('Cookie', global.signin())
    .send({
      name: 'videocardname',
      tdp: 'qwe',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/videocard')
    .set('Cookie', global.signin())
    .send({
      name: 'videocardname',
      effectiveMemoryClock: 'qweqwe',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/videocard')
    .set('Cookie', global.signin())
    .send({
      name: 'videocardname',
      expansionSlotWidth: 'qweqw',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/videocard')
    .set('Cookie', global.signin())
    .send({
      name: 'videocardname',
      manufacturer: {},
    })
    .expect(400)

  await request(app)
    .post('/api/parts/videocard')
    .set('Cookie', global.signin())
    .send({
      name: 'videocardname',
      itemCode: 123,
    })
    .expect(400)

  await request(app)
    .post('/api/parts/videocard')
    .set('Cookie', global.signin())
    .send({
      name: 'videocardname',
      itemImages: [],
    })
    .expect(400)

  await request(app)
    .post('/api/parts/videocard')
    .set('Cookie', global.signin())
    .send({
      name: 'videocardname',
      measurements: {
        length: 1,
        height: 2,
        width: 'qweqwe',
        dimension: 'qweqwe',
      },
    })
    .expect(400)
})

it('dont create duplicate videocard name', async () => {
  const videocard = VideoCard.build({
    name: 'videocardname',
  })
  await videocard.save()

  const res = await request(app)
    .post('/api/parts/videocard')
    .set('Cookie', global.signin())
    .send({
      name: 'videocardname',
    })

  expect(res.body.errors[0].message).toEqual('Name is already exist')
})

it('create new videocard if provided valid argument', async () => {
  await request(app)
    .post('/api/parts/videocard')
    .set('Cookie', global.signin())
    .send({
      name: 'videocard',
    })

  expect((await VideoCard.find()).length).toEqual(1)
})
