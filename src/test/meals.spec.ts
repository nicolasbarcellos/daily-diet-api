import { afterAll, beforeAll, it, describe, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../app'

import { execSync } from 'node:child_process'

describe('Meals Routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    execSync('knex migrate:rollback --all')
    execSync('knex migrate:latest')
  })

  it('should be able to create a new meal', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'Nicolas',
        email: 'nicolasbarcellos1323232111@gmail.com',
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

  it('should be able to list all meals from a user', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'Nicolas',
        email: 'nicolasbarcellos2333@gmail.com',
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie'))
      .send({
        title: 'Meal 01',
        description: 'This is Meal 01',
        isOnDiet: false,
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie'))
      .send({
        title: 'Meal 02',
        description: 'This is Meal 02',
        isOnDiet: true,
      })
      .expect(201)

    const mealsListResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', userResponse.get('Set-Cookie'))
      .expect(200)

    expect(mealsListResponse.body.meals).toHaveLength(2)
    expect(mealsListResponse.body.meals[0].title).toBe('Meal 01')
    expect(mealsListResponse.body.meals[1].title).toBe('Meal 02')
  })

  it('should get a unique meal by id', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'Nicolas',
        email: 'nicolasbarcellos2333@gmail.com',
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie'))
      .send({
        title: 'Meal 01',
        description: 'This is Meal 01',
        isOnDiet: false,
      })
      .expect(201)

    const mealsResponse = await request(app.server)
      .get(`/meals`)
      .set('Cookie', userResponse.get('Set-Cookie'))
      .expect(200)

    const id = mealsResponse.body.meals[0].id

    const mealResponse = await request(app.server)
      .get(`/meals/${id}`)
      .set('Cookie', userResponse.get('Set-Cookie'))
      .expect(200)

    expect(mealResponse.body).toEqual({
      meal: expect.objectContaining({
        title: 'Meal 01',
        description: 'This is Meal 01',
        isOnDiet: 0,
      }),
    })
  })

  it('should be able to update a meal by id', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'Nicolas',
        email: 'nicolasbarcellos2333@gmail.com',
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie'))
      .send({
        title: 'Meal 01',
        description: 'This is Meal 01',
        isOnDiet: false,
      })
      .expect(201)

    const mealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', userResponse.get('Set-Cookie'))
      .expect(200)

    const id = mealsResponse.body.meals[0].id

    await request(app.server)
      .put(`/meals/${id}`)
      .set('Cookie', userResponse.get('Set-Cookie'))
      .send({
        title: 'Meal 01 Updated',
      })
      .expect(204)
  })

  it('should be able to delete a meal by id', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'Nicolas',
        email: 'nicolasbarcellos2333@gmail.com',
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie'))
      .send({
        title: 'Meal 01',
        description: 'This is Meal 01',
        isOnDiet: false,
      })
      .expect(201)

    const mealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', userResponse.get('Set-Cookie'))
      .expect(200)

    const id = mealsResponse.body.meals[0].id

    await request(app.server)
      .delete(`/meals/${id}`)
      .set('Cookie', userResponse.get('Set-Cookie'))
      .expect(204)
  })

  it('should be able to get metrics from a user', async () => {
    const userResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'Nicolas',
        email: 'nicolasbarcellos2333@gmail.com',
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie'))
      .send({
        title: 'Meal 01',
        description: 'This is Meal 01',
        isOnDiet: false,
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', userResponse.get('Set-Cookie'))
      .send({
        title: 'Meal 01',
        description: 'This is Meal 01',
        isOnDiet: false,
      })
      .expect(201)

    const metricsResponse = await request(app.server)
      .get('/meals/metrics')
      .set('Cookie', userResponse.get('Set-Cookie'))
      .expect(200)

    expect(metricsResponse.body).toEqual([
      {
        totalMeals: 2,
        totalMealsOnDiet: 0,
        totalMealsOffDiet: 2,
        bestOnDietSequence: 0,
      },
    ])
  })
})
