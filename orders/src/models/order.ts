import mongoose from 'mongoose'
import { OrderStatus } from '@playedby/common'

import { Ticket, TicketDoc } from "./ticket";

export { OrderStatus }

// * An interface that describes the attributes
// * that are required to create a new Order
interface OrderAttrs {
  userId: string
  status: OrderStatus
  expiresAt: Date
  ticket: TicketDoc
}

// * An interface that describes the props
// * that a Order Model has
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc
}

// * An interface that describes the props
// * that a Order Document has
interface OrderDoc extends mongoose.Document {
  userId: string
  status: OrderStatus
  expiresAt: Date
  ticket: TicketDoc
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Ticket,
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

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs)
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema)

export { Order }
