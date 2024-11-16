import express from 'express'
import { getAvailableSlots, bookAppointment, cancelAppointment } from '../controller/appointment.controller'
import validate from '../middleware/validateResource'
import { createAppointmentSchema } from '../schema/appointment.schema'

const router = express.Router()

router.get('/available-slots', getAvailableSlots)
router.post('/', validate(createAppointmentSchema), bookAppointment)
router.delete('/:id', cancelAppointment)

export default router
