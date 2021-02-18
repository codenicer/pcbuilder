import request from 'supertest'
import { app } from '../../../app'
import { Casing } from '../../../models/casing'

// import { natsWrapper } from '../../nats-wrapper';

it('returns 400 with invalid casing arguments', async () => {
  await request(app)
    .post('/api/parts/casing')
    .set('Cookie', global.signin())
    .send({
      name: 1,
    })
    .expect(400)

  await request(app)
    .post('/api/parts/casing')
    .set('Cookie', global.signin())
    .send({
      name: 'validname',
      motherboardFromFactor: [],
    })
    .expect(400)

  await request(app)
    .post('/api/parts/casing')
    .set('Cookie', global.signin())
    .send({
      name: 'validname',
      caseFrontPannelUsb: [],
    })
    .expect(400)

  await request(app)
    .post('/api/parts/casing')
    .set('Cookie', global.signin())
    .send({
      name: 'validname',
      maxVideoCardLength: [],
    })
    .expect(400)

  await request(app)
    .post('/api/parts/casing')
    .set('Cookie', global.signin())
    .send({
      name: 'validname',
      volume: [],
    })
    .expect(400)

  await request(app)
    .post('/api/parts/casing')
    .set('Cookie', global.signin())
    .send({
      name: 'validname',
      type: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/casing')
    .set('Cookie', global.signin())
    .send({
      name: 'validname',
      sidePanelWindow: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/casing')
    .set('Cookie', global.signin())
    .send({
      name: 'validname',
      powersupply: '',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/casing')
    .set('Cookie', global.signin())
    .send({
      name: 'validname',
      halfHeightExpansionSlot: 'qweqwe',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/casing')
    .set('Cookie', global.signin())
    .send({
      name: 'validname',
      fullHeightExpansionSlot: 'qweqwe',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/casing')
    .set('Cookie', global.signin())
    .send({
      name: 'validname',
      internal25Bays: 'qweqwe',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/casing')
    .set('Cookie', global.signin())
    .send({
      name: 'validname',
      internal35Bays: 'qweqwe',
    })
    .expect(400)

  await request(app)
    .post('/api/parts/casing')
    .set('Cookie', global.signin())
    .send({
      name: 'casingname',
      manufacturer: {},
    })
    .expect(400)

  await request(app)
    .post('/api/parts/casing')
    .set('Cookie', global.signin())
    .send({
      name: 'casingname',
      itemCode: 123123,
    })
    .expect(400)

  await request(app)
    .post('/api/parts/casing')
    .set('Cookie', global.signin())
    .send({
      name: 'casingname',
      itemImages: [],
    })
    .expect(400)

  await request(app)
    .post('/api/parts/casing')
    .set('Cookie', global.signin())
    .send({
      name: 'casingname',
      measurements: {
        length: 1,
        height: 2,
        width: 'qweqwe',
        dimension: 'qweqwe',
      },
    })
    .expect(400)
})

it('dont create duplicate casing name', async () => {
  const casing = Casing.build({
    name: 'casingname',
  })
  await casing.save()

  const res = await request(app)
    .post('/api/parts/casing')
    .set('Cookie', global.signin())
    .send({
      name: 'casingname',
    })
    .expect(400)

  expect(res.body.errors[0].message).toEqual('Name is already exist')
})

it('create new casing if provided valid argument', async () => {
  await request(app)
    .post('/api/parts/casing')
    .set('Cookie', global.signin())
    .send({
      name: 'casing',
    })
  expect((await Casing.find()).length).toEqual(1)
})
