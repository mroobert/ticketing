import { ValidationError } from 'express-validator'

import { CustomError } from '../errors/custom-error'

export class RequestValidationError extends CustomError {
  statusCode = 400
  constructor(public errors: ValidationError[]) {
    super('Request validation error.')

    // * Only because we are extending a built in class
    // * this is needed to restore the prototype chain
    Object.setPrototypeOf(this, RequestValidationError.prototype)
  }

  serializeErrors() {
    return this.errors.map((err) => {
      return { message: err.msg, field: err.param }
    })
  }
}
