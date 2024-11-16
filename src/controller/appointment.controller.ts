import { type Request, type Response } from 'express'
import { appointmentService } from '../service/appointment.service'
import { HTTP_STATUS } from '../utils/httpsUtils'
import type { CreateAppointmentInput } from '../schema/appointment.schema'

export const getAvailableSlots = async (req: Request, res: Response): Promise<void> => {
  const { date } = req.query
  if (date === undefined || date === null) {
    res.status(HTTP_STATUS.BAD_REQUEST).send({ message: 'Date is required' })
    return
  }

  const availableSlots = await appointmentService.getAvailableSlots(new Date(date as string))
  res.status(HTTP_STATUS.OK_GET).send(availableSlots)
}

export const bookAppointment = async (req: Request, res: Response): Promise<void> => {
  const { date, time, slots }: CreateAppointmentInput['body'] = req.body

  const parsedDate = new Date(date)
  if (isNaN(parsedDate.getTime())) {
    res.status(HTTP_STATUS.BAD_REQUEST).send({ message: 'Invalid date format' })
    return
  }

  const [hours, minutes] = time.split(':').map(Number)
  parsedDate.setHours(hours, minutes, 0, 0)
  const dateTime = parsedDate

  const success = await appointmentService.bookAppointment(dateTime, slots)
  if (!success) {
    res.status(HTTP_STATUS.CONFLICT).send({ message: 'Slot is already fully booked' })
    return
  }

  res.status(HTTP_STATUS.OK_POST).send({ message: 'Appointment booked successfully' })
}

export const cancelAppointment = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params
  const success = await appointmentService.cancelAppointment(parseInt(id, 10))

  if (!success) {
    res.status(HTTP_STATUS.NOT_FOUND).send({ message: 'Appointment not found' })
    return
  }

  res.status(HTTP_STATUS.OK_GET).send({ message: 'Appointment canceled successfully' })
}
