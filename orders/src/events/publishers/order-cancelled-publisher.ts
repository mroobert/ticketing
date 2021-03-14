import { Publisher, Subjects } from '@playedby/common'
import type { OrderCancelledEvent } from '@playedby/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject: OrderCancelledEvent['subject'] = Subjects.OrderCancelled
}
