import { CustomError } from '../errors/custom-error'

export class RouteNotFoundError extends CustomError {
  statusCode = 404
  constructor() {
    super('Route not found.')

    // * Only because we are extending a built in class
    // * this is needed to restore the prototype chain
    Object.setPrototypeOf(this, RouteNotFoundError.prototype)
  }

  serializeErrors() {
    return [{ message: 'Not found.' }]
  }
}
