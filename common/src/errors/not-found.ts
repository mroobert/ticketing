import { CustomError } from '../errors/custom-error'

export class NotFoundError extends CustomError {
  statusCode = 404
  constructor() {
    super('Not found.')

    // * Only because we are extending a built in class
    // * this is needed to restore the prototype chain
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }

  serializeErrors() {
    return [{ message: 'Not found.' }]
  }
}
