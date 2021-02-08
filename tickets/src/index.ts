import mongoose from 'mongoose'

import { app } from './app'

const checkEnvs = () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined!')
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined!')
  }
}
const startMongoDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!, {
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
