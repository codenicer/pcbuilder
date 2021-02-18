import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../../app'
import { MotherBoard } from '../../../models/motherboard'
// import { natsWrapper } from '../../nats-wrapper';

it('returns 404 if motherboard was not found', async () => {
  await request(app)
    .get(`/api/parts/motherboard/${mongoose.Types.ObjectId().toHexString()}`)
    .set('Cookie', global.signin())
    .send()
    .expect(404)
})

it('show motherboard info ', async () => {
  const res = await request(app)
    .post('/api/parts/motherboard')
    .set('Cookie', global.signin())
    .send({
      name: 'motherboard name412151472q',
      cpuSocket: 'new cpu socket',
      formFactor: 'new form factor',
      chipset: 'new chipset',
      memoryType: 'new memory type',
      memorySpeed: [
        'memorySpeed1',
        'memorySpeed2',
        'memorySpeed3',
        'memorySpeed3',
      ],
      pcieSlots: [
        { name: 'pcieSlots1', count: 2 },
        { name: 'pcieSlots1', count: 2 },
        { name: 'pcieSlots3', count: 2 },
      ],
      usbSlots: [
        { name: 'usbslot1', count: 2 },
        { name: 'usbslot2', count: 2 },
        { name: 'usbslot3', count: 2 },
      ],
      sataSlots: [
        { name: 'sataslot1', count: 2 },
        { name: 'sataslot3', count: 2 },
        { name: 'sataslot32', count: 2 },
      ],
      wirelessNetworking: 'wirelessnetwork',
      onBoardVideo: 'onboardvideo',
      sliCrossFire: true,
      ramSlot: 23,
      onboardEthernet: 'onboardethernet',
      supportEcc: true,
      raidSupport: true,
    })
    .expect(201)

  await request(app)
    .get(`/api/parts/motherboard/${res.body.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(200)
})
