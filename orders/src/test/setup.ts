import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

jest.mock('../nats-wrapper')

let mongo: any

beforeAll(async () => {
  process.env.JWT_KEY = 'asdasfd'
  process.env.EXPIRATION_WINDOW_SECONDS = '120'

  mongo = new MongoMemoryServer()
  const mongoUri = await mongo.getUri()

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
})

beforeEach(async () => {
  jest.clearAllMocks()

  const collections = await mongoose.connection.db.collections()
  for (let collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await mongo.stop()
  mongoose.connection.close()
})
