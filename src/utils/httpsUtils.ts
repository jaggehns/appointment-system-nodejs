export const HTTP_STATUS = {
  OK_GET: 200,
  OK_POST: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  FORBIDDEN: 401,
  CONFLICT: 409,
  SERVER_ERROR: 500
} as const

type ObjectValues<T> = T[keyof T]

export type HttpStatus = ObjectValues<typeof HTTP_STATUS>
