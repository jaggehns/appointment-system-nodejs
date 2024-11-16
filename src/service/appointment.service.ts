import { appointmentModel } from '../models/appointment.model'
import { configurationModel } from '../models/configuration.model'
import { type UpdateConfigurationInput } from '../schema/configuration.schema'

interface AvailableSlot {
  time: string
  available_slots: number
}

interface AvailableSlot {
  time: string
  available_slots: number
}

const getAvailableSlots = async (date: Date): Promise<AvailableSlot[]> => {
  const config: UpdateConfigurationInput['body'] | null = await configurationModel.getFullConfiguration()
  const startHour = config?.startHour != null ? parseInt(config.startHour.split(':')[0]) : 9
  const endHour = config?.endHour != null ? parseInt(config.endHour.split(':')[0]) : 18
  const maxSlots = config?.maxSlots ?? 1

  const slots: AvailableSlot[] = []

  for (let hour = startHour; hour < endHour; hour++) {
    slots.push({ time: `${hour.toString().padStart(2, '0')}:00`, available_slots: maxSlots })
    slots.push({ time: `${hour.toString().padStart(2, '0')}:30`, available_slots: maxSlots })
  }

  const appointments = await appointmentModel.getAppointmentsForDay(date)

  for (const appointment of appointments) {
    const localTime = new Date(appointment.dateTime)
    const hours = localTime.getHours()
    const minutes = localTime.getMinutes()
    const appointmentTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

    console.info(`Checking appointment time: ${appointmentTime}`)

    slots.forEach((slot) => {
      if (slot.time === appointmentTime) {
        slot.available_slots -= appointment.slotsBooked
        if (slot.available_slots < 0) slot.available_slots = 0
      }
    })
  }

  return slots
}

const bookAppointment = async (dateTime: Date, slots: number): Promise<boolean> => {
  const config: UpdateConfigurationInput['body'] | null = await configurationModel.getFullConfiguration()
  const maxSlots = config?.maxSlots ?? 1

  const existingAppointments = await appointmentModel.getAppointmentsForTime(dateTime)
  const totalSlotsBooked = existingAppointments.reduce((total, appt) => total + appt.slotsBooked, 0)

  if (totalSlotsBooked + slots > maxSlots) {
    return false
  }

  await appointmentModel.createAppointment(dateTime, slots)
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
