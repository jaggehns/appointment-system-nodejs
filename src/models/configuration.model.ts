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

  let config = await db.configuration.findFirst({
    where: { startHour, endHour }
  })

  if (config != null) {
    config = await db.configuration.update({
      where: { id: config.id },
      data: { slotDuration, maxSlots, startHour, endHour }
    })
  } else {
    config = await db.configuration.create({
      data: { slotDuration, maxSlots, startHour, endHour }
    })
  }

  if (Array.isArray(daysOff)) {
    await db.daysOff.deleteMany({ where: { id: config.id } })
    for (const day of daysOff) {
      await db.daysOff.create({
        data: {
          date: new Date(day.date),
          description: day.description,
          id: config.id
        }
      })
    }
  }

  if (Array.isArray(unavailableHours)) {
    await db.unavailableHours.deleteMany({ where: { id: config.id } })
    for (const hour of unavailableHours) {
      await db.unavailableHours.create({
        data: { ...hour, id: config.id }
      })
    }
  }

  return config
}

export const configurationModel = {
  getFullConfiguration,
  updateFullConfiguration
}
