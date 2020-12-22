import express, { json } from 'express'
import mongoose from 'mongoose'
import 'express-async-errors'

import { currentUserRouter } from './routes/current-user'
import { signInRouter } from './routes/sign-in'
import { signUpRouter } from './routes/sign-up'
import { signOutRouter } from './routes/sign-out'

import { errorHandler } from './middlewares/error-handler'
import { RouteNotFoundError } from "./errors/route-not-found-error";

const app = express()
app.use(json())

app.use(currentUserRouter)
app.use(signInRouter)
app.use(signUpRouter)
app.use(signOutRouter)

app.all('*', ()=>{
  throw new RouteNotFoundError()
})

app.use(errorHandler)


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

startMongoDb()
