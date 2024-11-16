import express, { type Express } from 'express'

import 'express-async-errors'

import cors from 'cors'
import router from '../routes/index'
import { errorMiddleware } from '../middleware/errorMiddleware'

const createServer = (): Express => {
  const app = express()

  app.use(cors())

  app.use(express.json())

  app.use(express.urlencoded({ extended: true }))

  app.use('/v1/api', router)

  app.use(errorMiddleware)

  return app
}

export default createServer
