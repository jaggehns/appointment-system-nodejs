import db from '../modules/db'
import type { UpdateConfigurationInput } from '../schema/configuration.schema'

const getFullConfiguration = async (): Promise<any> => {
  const config = await db.configuration.findFirst()
  const daysOff = await db.daysOff.findMany()
  const unavailableHours = await db.unavailableHours.findMany()

  if (config === null) {
    return null
  }

  return {
    ...config,
    daysOff,
    unavailableHours
  }
}

const updateFullConfiguration = async (configData: UpdateConfigurationInput['body']): Promise<any> => {
  const { slotDuration, maxSlots, startHour, endHour, daysOff, unavailableHours } = configData

  const updatedConfig = await db.configuration.update({
    where: { id: 1 },
    data: { slotDuration, maxSlots, startHour, endHour }
  })

  // Update days off
  if (Array.isArray(daysOff)) {
    await db.daysOff.deleteMany()
    for (const day of daysOff) {
      await db.daysOff.create({ data: day })
    }
  }

  if (Array.isArray(unavailableHours)) {
    await db.unavailableHours.deleteMany()
    for (const hour of unavailableHours) {
      await db.unavailableHours.create({ data: hour })
    }
  }

  return updatedConfig
}

export const configurationModel = {
  getFullConfiguration,
  updateFullConfiguration
}
