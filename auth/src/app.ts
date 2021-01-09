import express, { json } from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'

import { currentUserRouter } from './routes/current-user'
import { signInRouter } from './routes/sign-in'
import { signUpRouter } from './routes/sign-up'
import { signOutRouter } from './routes/sign-out'

import { errorHandler } from './middlewares/error-handler'
import { RouteNotFoundError } from './errors/route-not-found-error'

const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
)

app.use(currentUserRouter)
app.use(signInRouter)
app.use(signUpRouter)
app.use(signOutRouter)

app.all('*', () => {
  throw new RouteNotFoundError()
})

app.use(errorHandler)

export { app }
