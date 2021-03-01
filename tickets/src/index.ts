import mongoose from 'mongoose'

import { app } from './app'
import { natsWrapper } from './nats-wrapper'

function checkEnvs() {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined!')
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined!')
  }
  if (!process.env.NATS_URI) {
    throw new Error('NATS_URI must be defined!')
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined!')
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined!')
  }
}

async function startMongoDb() {
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

async function startNatsClient() {
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID!,
      process.env.NATS_CLIENT_ID!,
      process.env.NATS_URI!
    )

    natsWrapper.client.on('close', function handleCloseConnection() {
      console.log('NATS connection closed!')
      process.exit()
    })

    natsWrapper.client.on('SIGINT', function handleSigint() {
      natsWrapper.client.close()
    })

    natsWrapper.client.on('SIGTERM', function handleSigterm() {
      natsWrapper.client.close()
    })
  } catch (err) {
    console.error(err)
  }
}

app.listen(3000, () => {
  console.log('listening on port 3000!!!!!')
})

checkEnvs()
startMongoDb()
startNatsClient()
