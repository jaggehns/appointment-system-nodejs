import { appointmentModel } from '../models/appointment.model'

interface AvailableSlot {
  time: string
  available_slots: number
}

const getAvailableSlots = async (date: Date): Promise<AvailableSlot[]> => {
  const config = await appointmentModel.getConfiguration()
  if (config == null) throw new Error('Configuration not found')

  const startHour = parseInt(config.startHour.split(':')[0])
  const endHour = parseInt(config.endHour.split(':')[0])
  const slots: AvailableSlot[] = []

  for (let hour = startHour; hour < endHour; hour++) {
    slots.push({ time: `${hour}:00`, available_slots: config.maxSlots })
    slots.push({ time: `${hour}:30`, available_slots: config.maxSlots })
  }

  const appointments = await appointmentModel.getAvailableAppointments(date)
  for (const appointment of appointments) {
    slots.forEach((slot) => {
      if (slot.time === appointment.time.toTimeString().slice(0, 5)) {
        slot.available_slots -= appointment.slotsBooked
      }
    })
  }

  return slots
}

const bookAppointment = async (date: Date, time: string, slots: number): Promise<boolean> => {
  const existingAppointments = await appointmentModel.getAvailableAppointments(date)
  const existingAppointment = existingAppointments.find((appt) => appt.time.toTimeString().slice(0, 5) === time)

  if (existingAppointment != null && existingAppointment.slotsBooked >= slots) {
    return false
  }

  await appointmentModel.createAppointment(date, time, slots)
  return true
}

const cancelAppointment = async (id: number): Promise<boolean> => {
  try {
    await appointmentModel.deleteAppointment(id)
    return true
  } catch {
    return false
  }
}

export const appointmentService = {
  getAvailableSlots,
  bookAppointment,
  cancelAppointment
}
