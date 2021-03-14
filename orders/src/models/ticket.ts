import mongoose from 'mongoose'

import { Order, OrderStatus } from './order'

// * An interface that describes the attributes
// * that are required to create a new Ticket
interface TicketAttrs {
  title: string
  price: number
}

// * An interface that describes the props
// * that a Ticket Model has
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc
}

// * An interface that describes the props
// * that a Ticket Document has
interface TicketDoc extends mongoose.Document {
  title: string
  price: number
  isReserved(): Promise<boolean>
}

const ticketSchema = new mongoose.Schema<TicketDoc, TicketModel>(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        //?Info: This is a shortcut for normalizing user model for API response.
        //*TODO: create a Service for normalization
        ret.id = ret._id
        delete ret._id
        delete ret.__v
      },
    },
  }
)

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs)
}

ticketSchema.methods.isReserved = async function isReserved(this: TicketDoc) {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [OrderStatus.Created, OrderStatus.AwaitingPayment, OrderStatus.Complete],
    },
  })
  return !!existingOrder
}

const Ticket = mongoose.model('Ticket', ticketSchema)

export { Ticket, TicketDoc }
