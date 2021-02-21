import type { Message, Stan } from 'node-nats-streaming'

import type { Event } from './event'

export abstract class Listener<T extends Event> {
  abstract subject: T['subject']
  abstract queueGroupName: string
  abstract onMessage(data: T['data'], msg: Message): void
  private client: Stan
  protected ackWait = 5 * 1000 //* the default value is 30s

  constructor(client: Stan) {
    this.client = client
  }

  subscriptionOptions() {
    return (
      this.client
        .subscriptionOptions()
        //* Send all messages(events) when the subscription is created for the first time
        .setDeliverAllAvailable()
        .setManualAckMode(true)
        .setAckWait(this.ackWait)
        //* Send all missed messages(events)
        //! The durable name has to be the queueGroupName, so NATS can persist
        //! this durable subscription
        .setDurableName(this.queueGroupName)
    )
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    )

    subscription.on('message', (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`)

      const parsedData = this.parseMessage(msg)
      this.onMessage(parsedData, msg)
    })
  }

  parseMessage(msg: Message) {
    const data = msg.getData()
    return typeof data === 'string' ? JSON.parse(data) : JSON.parse(data.toString('utf8'))
  }
}
