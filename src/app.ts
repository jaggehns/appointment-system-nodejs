import 'dotenv/config'

import config from 'config'
import logger from './utils/logger'
import createServer from './utils/server'

const port = config.get<number>('port')

const app = createServer()

app.listen(port, () => {
  logger.info(`App is started at http://localhost:${port}`)
})
