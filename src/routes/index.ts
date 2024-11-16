import express from 'express'
import appointment from './appointment.routes'

const router = express.Router()

router.get('/healthcheck', (_, res) => res.sendStatus(200))

router.use('/appointment', appointment)

export default router
