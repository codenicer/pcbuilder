import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../../app'
// import { natsWrapper } from '../../nats-wrapper';

it('returns 404 if power supply was not found', async () => {
  await request(app)
    .get(`/api/parts/powersupply/${mongoose.Types.ObjectId().toHexString()}`)
    .set('Cookie', global.signin())
    .send()
    .expect(404)
})

it('show processor info ', async () => {
  const res = await request(app)
    .post('/api/parts/powersupply')
    .set('Cookie', global.signin())
    .send({
      name: 'randomname',
    })
    .expect(201)

  await request(app)
    .get(`/api/parts/powersupply/${res.body.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(200)
})
