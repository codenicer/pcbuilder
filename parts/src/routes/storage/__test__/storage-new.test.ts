import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../../app'
import { Items } from '../../../models/items'
import { Storage } from '../../../models/storage'

it('returns 400 with invalid storage arguments', async () => {
  await request(app)
    .post('/api/parts/storage')
    .set('Cookie', global.signin())
    .send({
      name: 1,
    })
    .expect(400)

  await request(app)
    .post('/api/parts/storage')
    .set('Cookie', global.signin())
    .send({
      name: 'storagename',
      formFactor: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/storage')
    .set('Cookie', global.signin())
    .send({
      name: 'storagename',
      interfaces: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/storage')
    .set('Cookie', global.signin())
    .send({
      name: 'storagename',
      capacity: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/storage')
    .set('Cookie', global.signin())
    .send({
      name: 'storagename',
      pricePerGb: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/storage')
    .set('Cookie', global.signin())
    .send({
      name: 'storagename',
      type: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/storage')
    .set('Cookie', global.signin())
    .send({
      name: 'storagename',
      isNvme: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/storage')
    .set('Cookie', global.signin())
    .send({
      name: 'storagename',
      manufacturer: {},
    })
    .expect(400)

  await request(app)
    .post('/api/parts/storage')
    .set('Cookie', global.signin())
    .send({
      name: 'storagename',
      itemCode: 123,
    })
    .expect(400)

  await request(app)
    .post('/api/parts/storage')
    .set('Cookie', global.signin())
    .send({
      name: 'storagename',
      itemImages: [],
    })
    .expect(400)

  await request(app)
    .post('/api/parts/storage')
    .set('Cookie', global.signin())
    .send({
      name: 'storagename',
      measurements: {
        length: 1,
        height: 2,
        width: 'qweqwe',
        dimension: 'qweqwe',
      },
    })
    .expect(400)
})

it('dont create duplicate storage name', async () => {
  const itemInfo = Items.build({
    name: 'storagename',
  })

  await itemInfo.save()

  const storage = Storage.build({
    itemInfo,
  })
  await storage.save()

  const res = await request(app)
    .post('/api/parts/storage')
    .set('Cookie', global.signin())
    .send({
      name: 'storagename',
    })

  expect(res.body.errors[0].message).toEqual('Name is already exist')
})

it('create new storage if provided valid argument', async () => {
  await request(app)
    .post('/api/parts/storage')
    .set('Cookie', global.signin())
    .send({
      name: 'storage',
    })

  expect((await Storage.find()).length).toEqual(1)
})
