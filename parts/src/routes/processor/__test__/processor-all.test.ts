import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../../app'
import { Items } from '../../../models/items'
import { Processor } from '../../../models/processor'
// import { natsWrapper } from '../../nats-wrapper';

async function createProcessor() {
  const itemInfo = Items.build({
    name: mongoose.Types.ObjectId().toHexString().slice(0, 5),
  })

  await itemInfo.save()

  const processor = Processor.build({
    itemInfo,
  })
  await processor.save()
}

it('paginates processors', async () => {
  for (let i = 0; i < 6; i++) {
    await createProcessor()
  }

  const firstPage = await request(app)
    .get(`/api/parts/processor/`)
    .set('Cookie', global.signin())
    .send()
    .expect(200)

  expect(firstPage.body.currentPage).toEqual(1)
  expect(firstPage.body.nextPage).toEqual(2)

  const secondPage = await request(app)
    .get(`/api/parts/processor/?page=2`)
    .set('Cookie', global.signin())
    .send()
    .expect(200)

  expect(secondPage.body.currentPage).toEqual(2)
  expect(secondPage.body.nextPage).toEqual(3)

  const thirdPage = await request(app)
    .get(`/api/parts/processor/?page=3`)
    .set('Cookie', global.signin())
    .send()
    .expect(200)

  expect(thirdPage.body.currentPage).toEqual(3)
  expect(thirdPage.body.nextPage).toEqual(4)
})

it('paginate to page 1 if provided invalid query', async () => {
  for (let i = 0; i < 6; i++) {
    await createProcessor()
  }

  const firstPage = await request(app)
    .get(`/api/parts/processor/?page=qweqweqwe`)
    .set('Cookie', global.signin())
    .send()
    .expect(200)

  expect(firstPage.body.currentPage).toEqual(1)
  expect(firstPage.body.nextPage).toEqual(2)
})
