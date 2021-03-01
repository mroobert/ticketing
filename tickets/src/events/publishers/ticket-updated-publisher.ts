import { Publisher, Subjects } from '@playedby/common'
import type { TicketUpdatedEvent } from '@playedby/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject: TicketUpdatedEvent['subject'] = Subjects.TicketUpdated
}
