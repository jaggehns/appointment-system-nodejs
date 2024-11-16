import express from 'express'
import { getConfiguration, updateConfiguration } from '../controller/configuration.controller'
import validate from '../middleware/validateResource'
import { updateConfigurationSchema } from '../schema/configuration.schema'

const router = express.Router()

router.get('/', getConfiguration)
router.put('/', validate(updateConfigurationSchema), updateConfiguration)

export default router
