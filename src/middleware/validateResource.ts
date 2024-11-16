import type { NextFunction, Request, Response } from 'express'
import type { AnyZodObject } from 'zod'
import { BadRequestError } from '../common/errors'

const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({ body: req.body, query: req.query, params: req.params })
    next()
  } catch (e: any) {
    throw new BadRequestError(e.errors as string)
  }
}

export default validate
