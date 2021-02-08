import mongoose from 'mongoose'

// * An interface that describes the attributes
// * that are required to create a new Ticket
interface TicketAttrs {
  title: string
  price: number
  userId: string
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
  userId: string
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
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

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export { Ticket }
