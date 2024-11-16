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

  // Identify a unique criterion to select the configuration.
  // For example, let's assume you want to use `startHour` and `endHour` as the unique criteria.
  let config = await db.configuration.findFirst({
    where: { startHour, endHour }
  })

  if (config != null) {
    // Update the existing configuration
    config = await db.configuration.update({
      where: { id: config.id },
      data: { slotDuration, maxSlots, startHour, endHour }
    })
  } else {
    // Create a new configuration if none matches the criteria
    config = await db.configuration.create({
      data: { slotDuration, maxSlots, startHour, endHour }
    })
  }

  // Update days off
  if (Array.isArray(daysOff)) {
    // Assume you want to link days off to this specific configuration
    // Clear existing days off associated with this configuration (if needed)
    await db.daysOff.deleteMany({ where: { id: config.id } })
    for (const day of daysOff) {
      await db.daysOff.create({
        data: {
          date: new Date(day.date), // Convert the string to a Date object
          description: day.description,
          id: config.id
        }
      })
    }
  }

  // Update unavailable hours
  if (Array.isArray(unavailableHours)) {
    // Clear existing unavailable hours associated with this configuration (if needed)
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
