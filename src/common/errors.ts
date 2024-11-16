import { type HttpStatus, HTTP_STATUS } from '../utils/httpsUtils'

export class CustomError extends Error {
  code: HttpStatus
  message: string
  constructor(code: HttpStatus, message: string) {
    super()
    this.code = code
    this.message = message
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string) {
    super(HTTP_STATUS.BAD_REQUEST, message)
  }
}
export class NotFoundError extends CustomError {
  constructor(message: string) {
    super(HTTP_STATUS.NOT_FOUND, message)
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string) {
    super(HTTP_STATUS.FORBIDDEN, message)
  }
}

export class ConflictError extends CustomError {
  constructor(message: string) {
    super(HTTP_STATUS.CONFLICT, message)
  }
}
