export enum OrderStatus {
  //* When the order has been created, and
  //* the ticket on the order has not been already reserved
  Created = 'created',

  //* When the ticket on the order has been already reserved
  //* or when the user has cancelled the order
  //* or the order has expired before payment
  Cancelled = 'cancelled',

  //* The order has successfully reserved the ticket
  AwaitingPayment = 'awaiting:payment',

  //* When the user provided payment successfully for the reserved ticket
  Complete = 'complete',
}
