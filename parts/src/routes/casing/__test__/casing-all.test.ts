import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../../app'
import { Casing } from '../../../models/casing'
import { Items } from '../../../models/items'
// import { natsWrapper } from '../../nats-wrapper';

async function createCasing() {
  const itemInfo = Items.build({
    name: mongoose.Types.ObjectId().toHexString().slice(0, 5),
  })
  await itemInfo.save()

  const casing = Casing.build({
    itemInfo: itemInfo,
  })
  await casing.save()
}

it('paginates casing', async () => {
  for (let i = 0; i < 6; i++) {
    await createCasing()
  }

  const firstPage = await request(app)
    .get(`/api/parts/casing/`)
    .set('Cookie', global.signin())
    .send()
    .expect(200)

  expect(firstPage.body.currentPage).toEqual(1)
  expect(firstPage.body.nextPage).toEqual(2)

  const secondPage = await request(app)
    .get(`/api/parts/casing/?page=2`)
    .set('Cookie', global.signin())
    .send()
    .expect(200)

  expect(secondPage.body.currentPage).toEqual(2)
  expect(secondPage.body.nextPage).toEqual(3)

  const thirdPage = await request(app)
    .get(`/api/parts/casing/?page=3`)
    .set('Cookie', global.signin())
    .send()
    .expect(200)

  expect(thirdPage.body.currentPage).toEqual(3)
  expect(thirdPage.body.nextPage).toEqual(4)
})

it('paginate to page 1 if provided invalid query', async () => {
  for (let i = 0; i < 6; i++) {
    await createCasing()
  }

  const firstPage = await request(app)
    .get(`/api/parts/casing/?page=1`)
    .set('Cookie', global.signin())
    .send()
    .expect(200)

  expect(firstPage.body.currentPage).toEqual(1)
  expect(firstPage.body.nextPage).toEqual(2)
})
