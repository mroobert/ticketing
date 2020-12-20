import express, { json } from 'express'

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

app.listen(3000, () => {
  console.log('listening on port 3000!!!!!')
})
