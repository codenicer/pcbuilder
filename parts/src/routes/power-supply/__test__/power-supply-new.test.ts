import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../../app'
import { PowerSupply } from '../../../models/power-supply'

// import { natsWrapper } from '../../nats-wrapper';

it('returns 400 with invalid powersupply arguments', async () => {
  await request(app)
    .post('/api/parts/powersupply')
    .set('Cookie', global.signin())
    .send({
      name: 1,
    })
    .expect(400)

  await request(app)
    .post('/api/parts/powersupply')
    .set('Cookie', global.signin())
    .send({
      name: 'powersupplyname',
      formFactor: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/powersupply')
    .set('Cookie', global.signin())
    .send({
      name: 'powersupplyname',
      psuConnectors: [],
    })
    .expect(400)

  await request(app)
    .post('/api/parts/powersupply')
    .set('Cookie', global.signin())
    .send({
      name: 'powersupplyname',
      efficiencyRating: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/powersupply')
    .set('Cookie', global.signin())
    .send({
      name: 'powersupplyname',
      modular: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/powersupply')
    .set('Cookie', global.signin())
    .send({
      name: 'powersupplyname',
      type: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/powersupply')
    .set('Cookie', global.signin())
    .send({
      name: 'powersupplyname',
      wattage: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/powersupply')
    .set('Cookie', global.signin())
    .send({
      name: 'powersupplyname',
      fanless: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/powersupply')
    .set('Cookie', global.signin())
    .send({
      name: 'powersupplyname',
      manufacturer: {},
    })
    .expect(400)

  await request(app)
    .post('/api/parts/powersupply')
    .set('Cookie', global.signin())
    .send({
      name: 'powersupplyname',
      itemCode: 123,
    })
    .expect(400)

  await request(app)
    .post('/api/parts/powersupply')
    .set('Cookie', global.signin())
    .send({
      name: 'powersupplyname',
      itemImages: [],
    })
    .expect(400)

  await request(app)
    .post('/api/parts/powersupply')
    .set('Cookie', global.signin())
    .send({
      name: 'powersupplyname',
      measurements: {
        length: 1,
        height: 2,
        width: 'qweqwe',
        dimension: 'qweqwe',
      },
    })
    .expect(400)
})

it('dont create duplicate powersupply name', async () => {
  const powerSupply = PowerSupply.build({
    name: 'powersupplyname',
  })

  await powerSupply.save()

  const res = await request(app)
    .post('/api/parts/powersupply')
    .set('Cookie', global.signin())
    .send({
      name: 'powersupplyname',
    })

  expect(res.body.errors[0].message).toEqual('Name is already exist')
})

it('create new power supply if provided valid argument', async () => {
  await request(app)
    .post('/api/parts/powersupply')
    .set('Cookie', global.signin())
    .send({
      name: 'powersupplyname',
    })
  expect((await PowerSupply.find()).length).toEqual(1)
})
