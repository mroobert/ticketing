import express, { json } from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'

import { errorHandler, RouteNotFoundError, currentUser } from '@playedby/common'
import { createOrderRouter } from './routes/create-order'
import { retrieveOrderRouter } from './routes/retrieve-order'
import { retrieveOrdersRouter } from "./routes/retrieve-orders";
import { cancelOrderRouter } from "./routes/cancel-order";

const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
)

app.use(currentUser)
app.use(createOrderRouter)
app.use(retrieveOrderRouter)
app.use(retrieveOrdersRouter)
app.use(cancelOrderRouter)

app.all('*', () => {
  throw new RouteNotFoundError()
})

app.use(errorHandler)

export { app }
