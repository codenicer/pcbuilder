import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../../app'
import { Storage } from '../../../models/storage'

it('returns 404 if storage was not found', async () => {
  await request(app)
    .get(`/api/parts/storage/${mongoose.Types.ObjectId().toHexString()}`)
    .set('Cookie', global.signin())
    .send()
    .expect(404)
})

it('show storage info ', async () => {
  const res = await request(app)
    .post('/api/parts/storage')
    .set('Cookie', global.signin())
    .send({
      name: 'storagename',
    })
    .expect(201)

  await request(app)
    .get(`/api/parts/storage/${res.body.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(200)
})
