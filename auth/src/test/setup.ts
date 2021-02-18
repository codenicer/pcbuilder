import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../app'

declare global {
  namespace NodeJS {
    interface Global {
      signin(): Promise<string[]>
      sampleUser: {
        email: string
        password: string
        username: string
        firstName: string
        middleName: string
        lastName: string
      }
    }
  }
}

const sampleUser = {
  email: 'test@test.com',
  password: 'password',
  username: 'testusername',
  firstName: 'testfname',
  lastName: 'testlname',
  middleName: 'testmname',
}

let mongo: any
beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf'
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

  mongo = new MongoMemoryServer()
  const mongoUri = await mongo.getUri()

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
})

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections()

  for (let collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close()
})

global.sampleUser = sampleUser

global.signin = async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send(sampleUser)
    .expect(201)

  const cookie = response.get('Set-Cookie')

  return cookie
}
