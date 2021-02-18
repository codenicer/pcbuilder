import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../../app'
// import { natsWrapper } from '../../nats-wrapper';

it('returns 404 if cpu cooler was not found', async () => {
  await request(app)
    .get(`/api/parts/cpucooler/${mongoose.Types.ObjectId().toHexString()}`)
    .set('Cookie', global.signin())
    .send()
    .expect(404)
})

it('show cpu cooler info ', async () => {
  const res = await request(app)
    .post('/api/parts/cpucooler')
    .set('Cookie', global.signin())
    .send({
      name: 'randomname',
    })
    .expect(201)

  await request(app)
    .get(`/api/parts/cpucooler/${res.body.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(200)
})
