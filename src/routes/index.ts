import express from 'express'
import appointmentRoutes from './appointment.routes'
import configurationRoutes from './configuration.routes'

const router = express.Router()

router.get('/healthcheck', (_, res) => res.sendStatus(200))
router.use('/appointment', appointmentRoutes)
router.use('/configuration', configurationRoutes)

export default router
