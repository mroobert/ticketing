import mongoose from 'mongoose'

import { app } from './app'

const checkEnvs = () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined!')
  }
}
const startMongoDb = async () => {
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    console.log('Connected to MongoDb')
  } catch (err) {
    console.error(err)
  }
}
app.listen(3000, () => {
  console.log('listening on port 3000!!!!!')
})

checkEnvs()
startMongoDb()
