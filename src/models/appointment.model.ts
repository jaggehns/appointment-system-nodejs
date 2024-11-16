import { type Appointment } from '@prisma/client'
import db from '../modules/db'

const getAppointmentsForDay = async (date: Date): Promise<Appointment[]> => {
  const startOfDayUtc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0))
  const endOfDayUtc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59))

  return await db.appointment.findMany({
    where: {
      dateTime: {
        gte: startOfDayUtc,
        lte: endOfDayUtc
      }
    }
  })
}

const getAppointmentsForTime = async (dateTime: Date): Promise<Appointment[]> => {
  return await db.appointment.findMany({
    where: {
      dateTime
    }
  })
}

const createAppointment = async (dateTime: Date, slotsBooked: number): Promise<Appointment> => {
  return await db.appointment.create({
    data: { dateTime, slotsBooked }
  })
}

const deleteAppointment = async (id: number): Promise<Appointment> => {
  return await db.appointment.delete({ where: { id } })
}

export const appointmentModel = {
  getAppointmentsForDay,
  getAppointmentsForTime,
  createAppointment,
  deleteAppointment
}
