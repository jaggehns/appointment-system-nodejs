import { appointmentModel } from '../models/appointment.model'
import { configurationModel } from '../models/configuration.model'
import { type UpdateConfigurationInput } from '../schema/configuration.schema'

interface AvailableSlot {
  time: string
  available_slots: number
}

const getAvailableSlots = async (date: Date): Promise<AvailableSlot[]> => {
  const config: UpdateConfigurationInput['body'] | null = await configurationModel.getFullConfiguration()

  const startHour =
    config?.startHour != null && config.startHour.trim() !== '' ? parseInt(config.startHour.split(':')[0]) : 9
  const endHour = config?.endHour != null && config.endHour.trim() !== '' ? parseInt(config.endHour.split(':')[0]) : 18
  const maxSlots = config?.maxSlots ?? 1

  const slots: AvailableSlot[] = []

  for (let hour = startHour; hour < endHour; hour++) {
    slots.push({ time: `${hour}:00`, available_slots: maxSlots })
    slots.push({ time: `${hour}:30`, available_slots: maxSlots })
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
  const config: UpdateConfigurationInput['body'] | null = await configurationModel.getFullConfiguration()

  const maxSlots = config?.maxSlots ?? 1

  const existingAppointments = await appointmentModel.getAvailableAppointments(date)
  const existingAppointment = existingAppointments.find((appt) => appt.time.toTimeString().slice(0, 5) === time)

  if (existingAppointment != null && existingAppointment.slotsBooked >= maxSlots) {
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
