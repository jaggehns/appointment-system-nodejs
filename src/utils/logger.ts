import pino from 'pino'
import dayjs from 'dayjs'
import config from 'config'

const level = config.get<string>('logLevel')

const log = pino({
  transport: {
    target: 'pino-pretty'
  },
  level,
  base: {
    pid: false
  },
  timestamp: () => `,"time":"${dayjs().format()}"`
})

export default log
