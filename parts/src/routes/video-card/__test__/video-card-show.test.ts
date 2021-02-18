import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../../app'
import { VideoCard } from '../../../models/video-card'
// import { natsWrapper } from '../../nats-wrapper';

it('returns 404 if videocard was not found', async () => {
  await request(app)
    .get(`/api/parts/videocard/${mongoose.Types.ObjectId().toHexString()}`)
    .set('Cookie', global.signin())
    .send()
    .expect(404)
})

it('show videocard info ', async () => {
  const res = await request(app)
    .post('/api/parts/videocard')
    .set('Cookie', global.signin())
    .send({
      name: 'videocardname',
      chipset: 'chipset',
      memoryType: 'memoryType',
      interfaces: 'interfaces',
      sliCrossfireType: 'sliCrossfireType',
      ports: [
        { name: 'port1', count: 2 },
        { name: 'port2', count: 2 },
      ],
      frameSync: 'frameSync',
      cooling: 'cooling',
      externalPower: 'externalPower',
      memory: 1,
      coreClock: 1,
      boostClock: 1,
      tdp: 1,
      effectiveMemoryClock: 1,
      expansionSlotWidth: 1,
    })
    .expect(201)

  await request(app)
    .get(`/api/parts/videocard/${res.body.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(200)
})
