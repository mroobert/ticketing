import express, { json } from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'

import { errorHandler, RouteNotFoundError, currentUser } from '@playedby/common'
import { createTicketRouter } from './routes/create-ticket'
import { retrieveTicketRouter } from './routes/retrieve-ticket'
import { retrieveTicketsRouter } from "./routes/retrieve-tickets";
import { updateTicketRouter } from "./routes/update-ticket";

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
app.use(createTicketRouter)
app.use(retrieveTicketRouter)
app.use(retrieveTicketsRouter)
app.use(updateTicketRouter)

app.all('*', () => {
  throw new RouteNotFoundError()
})

app.use(errorHandler)

export { app }
