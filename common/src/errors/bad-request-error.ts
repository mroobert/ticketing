import { CustomError } from './custom-error'

export class BadRequestError extends CustomError {
  statusCode = 400
  constructor(public message: string) {
    super(message)

    // * Only because we are extending a built in class
    // * this is needed to restore the prototype chain
    Object.setPrototypeOf(this, BadRequestError.prototype)
  }

  serializeErrors() {
    return [{ message: this.message }]
  }
}
