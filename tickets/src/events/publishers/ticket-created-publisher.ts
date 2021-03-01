import { Publisher, Subjects } from '@playedby/common'
import type { TicketCreatedEvent } from '@playedby/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject: TicketCreatedEvent['subject'] = Subjects.TicketCreated
}
