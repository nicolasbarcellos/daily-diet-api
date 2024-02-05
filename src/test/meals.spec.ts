import { afterAll, beforeAll, it, describe } from 'vitest'
import request from 'supertest'
import { app } from '../app'

describe('Meals Routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a new meal', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'Nicolas',
        email: 'nicolasbarcellos9232325@gmail.com',
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie'))
      .send({
        title: 'New Meal',
        description: 'This is a new meal',
        isOnDiet: false,
      })
      .expect(201)
  })

  it('should be able to list all meals from a user', async () => {})
})
