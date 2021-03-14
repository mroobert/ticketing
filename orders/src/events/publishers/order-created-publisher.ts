import { Publisher, Subjects } from '@playedby/common'
import type { OrderCreatedEvent } from '@playedby/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject: OrderCreatedEvent['subject'] = Subjects.OrderCreated
}
