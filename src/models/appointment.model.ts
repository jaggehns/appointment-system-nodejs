import { type Appointment, type Configuration } from '@prisma/client'
import db from '../modules/db'

const getAvailableAppointments = async (date: Date): Promise<Appointment[]> => {
  return await db.appointment.findMany({ where: { date } })
}

const getConfiguration = async (): Promise<Configuration | null> => {
  return await db.configuration.findFirst()
}

const createAppointment = async (date: Date, time: string, slotsBooked: number): Promise<Appointment> => {
  return await db.appointment.create({
    data: { date, time, slotsBooked }
  })
}

const deleteAppointment = async (id: number): Promise<Appointment> => {
  return await db.appointment.delete({ where: { id } })
}

export const appointmentModel = {
  getAvailableAppointments,
  getConfiguration,
  createAppointment,
  deleteAppointment
}
