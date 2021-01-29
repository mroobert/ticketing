import { CustomError } from '../errors/custom-error'

export class DatabaseConnectionError extends CustomError {
  statusCode = 500
  constructor() {
    super('Error connecting to the database.')

    // * Only because we are extending a built in class
    // * this is needed to restore the prototype chain
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
  }

  serializeErrors() {
    return [{ message: 'Error connecting to the database.' }]
  }
}
