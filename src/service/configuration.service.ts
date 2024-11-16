import { configurationModel } from '../models/configuration.model'
import { type UpdateConfigurationInput } from '../schema/configuration.schema'

export const getConfiguration = async (): Promise<any> => {
  return await configurationModel.getFullConfiguration()
}

export const updateConfiguration = async (configData: UpdateConfigurationInput['body']): Promise<any> => {
  return await configurationModel.updateFullConfiguration(configData)
}

export const configurationService = {
  getConfiguration,
  updateConfiguration
}
