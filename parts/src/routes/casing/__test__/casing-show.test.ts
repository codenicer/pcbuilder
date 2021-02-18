import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../../app'
// import { natsWrapper } from '../../nats-wrapper';

it('returns 404 if casing was not found', async () => {
  await request(app)
    .get(`/api/parts/casing/${mongoose.Types.ObjectId().toHexString()}`)
    .set('Cookie', global.signin())
    .send()
    .expect(404)
})

it('show casing info ', async () => {
  const res = await request(app)
    .post('/api/parts/casing')
    .set('Cookie', global.signin())
    .send({
      name: 'casing name412151472q',
      motherboardFromFactor: [
        'motherboardFromFactor1',
        'motherboardFromFactor2',
      ],
      caseFrontPannelUsb: ['caseFrontPannelUsb1', 'caseFrontPannelUsb2'],
      maxVideoCardLength: ['maxVideoCardLength', 'maxVideoCardLength'],
      volume: ['volume1', 'volume2'],
      type: 'type',
      sidePanelWindow: 'sidePanelWindow',
      powersupply: 'powersupply',
      halfHeightExpansionSlot: 1,
      fullHeightExpansionSlot: 1,
      internal25Bays: 1,
      internal35Bays: 1,
    })
    .expect(201)

  await request(app)
    .get(`/api/parts/casing/${res.body.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(200)
})
