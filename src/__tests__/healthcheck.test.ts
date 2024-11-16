import supertest from 'supertest'
import createServer from '../utils/server'

const app = createServer()

describe('healthcheck', () => {
  it('should return a 200', async () => {
    await supertest(app).get('/healthcheck').expect(200)
  })
})
