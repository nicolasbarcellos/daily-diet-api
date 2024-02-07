import { afterAll, beforeAll, it, describe, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../app'

import { execSync } from 'node:child_process'

describe('User Routes', () => {
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

  it('should be able to create a new user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'Nicolas',
        email: 'nicolasbarcellos1323232111@gmail.com',
      })
      .expect(201)
  })
})
