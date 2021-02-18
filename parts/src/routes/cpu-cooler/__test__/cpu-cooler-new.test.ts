import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../../app'
import { CpuCooler } from '../../../models/cpu-cooler'

// import { natsWrapper } from '../../nats-wrapper';

it('returns 400 with invalid cpu cooler arguments', async () => {
  await request(app)
    .post('/api/parts/cpucooler')
    .set('Cookie', global.signin())
    .send({
      name: 1,
    })
    .expect(400)

  await request(app)
    .post('/api/parts/cpucooler')
    .set('Cookie', global.signin())
    .send({
      name: 'cpucoolername',
      cpuSocket: [],
    })
    .expect(400)

  await request(app)
    .post('/api/parts/cpucooler')
    .set('Cookie', global.signin())
    .send({
      name: 'cpucoolername',
      coolerModel: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/cpucooler')
    .set('Cookie', global.signin())
    .send({
      name: 'cpucoolername',
      fanRpm: {},
    })
    .expect(400)

  await request(app)
    .post('/api/parts/cpucooler')
    .set('Cookie', global.signin())
    .send({
      name: 'cpucoolername',
      noiceLevel: {},
    })
    .expect(400)

  await request(app)
    .post('/api/parts/cpucooler')
    .set('Cookie', global.signin())
    .send({
      name: 'cpucoolername',
      bearing: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/cpucooler')
    .set('Cookie', global.signin())
    .send({
      name: 'cpucoolername',
      waterCooled: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/cpucooler')
    .set('Cookie', global.signin())
    .send({
      name: 'cpucoolername',
      fanless: '',
    })
    .expect(400)
})

it('dont create duplicate cpu cooler name', async () => {
  const cpucooler = CpuCooler.build({
    name: 'cpucoolername',
  })

  await cpucooler.save()
  const res = await request(app)
    .post('/api/parts/cpucooler')
    .set('Cookie', global.signin())
    .send({
      name: 'cpucoolername',
    })

  expect(res.body.errors[0].message).toEqual('Name is already exist')
})

it('create new cpu cooler if provided valid argument', async () => {
  await request(app)
    .post('/api/parts/cpucooler')
    .set('Cookie', global.signin())
    .send({
      name: 'cpucoolername',
    })
  expect((await CpuCooler.find()).length).toEqual(1)
})
