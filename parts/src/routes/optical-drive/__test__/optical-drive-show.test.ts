import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../../app'

it('returns 404 if optical drive was not found', async () => {
  await request(app)
    .get(`/api/parts/opticaldrive/${mongoose.Types.ObjectId().toHexString()}`)
    .set('Cookie', global.signin())
    .send()
    .expect(404)
})

it('show optical drive info ', async () => {
  const res = await request(app)
    .post('/api/parts/opticaldrive')
    .set('Cookie', global.signin())
    .send({
      name: 'opticaldrivename',
    })
    .expect(201)

  await request(app)
    .get(`/api/parts/opticaldrive/${res.body.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(200)
})
