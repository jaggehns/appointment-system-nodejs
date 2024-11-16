import type { Request, Response } from 'express'
import { configurationService } from '../service/configuration.service'

export const getConfiguration = async (_: Request, res: Response): Promise<void> => {
  try {
    const configData = await configurationService.getConfiguration()
    if (configData === null || configData === undefined) {
      res.status(404).send({ message: 'Configuration not found' })
      return
    }
    res.status(200).send(configData)
  } catch (error) {
    res.status(500).send({ message: 'Error retrieving configuration', error })
  }
}

export const updateConfiguration = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slotDuration, maxSlots, startHour, endHour, daysOff, unavailableHours } = req.body
    const updatedConfig = await configurationService.updateConfiguration({
      slotDuration,
      maxSlots,
      startHour,
      endHour,
      daysOff,
      unavailableHours
    })

    res.status(200).send({ message: 'Configuration updated successfully', updatedConfig })
  } catch (error) {
    res.status(500).send({ message: 'Error updating configuration', error })
  }
}
