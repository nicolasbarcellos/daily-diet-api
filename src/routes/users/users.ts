import crypto from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { knex } from '../../database'
import { z } from 'zod'

async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (req, reply) => {
    const createUsersBodySchema = z.object({
      name: z.string(),
      email: z.string(),
    })

    const { name, email } = createUsersBodySchema.parse(req.body)

    const userByEmail = await knex('users').where('email', email).first()

    if (userByEmail) {
      return reply.status(400).send({ message: 'User already exists' })
    }

    const sessionId = req.cookies.sessionId || crypto.randomUUID()

    reply.cookie('sessionId', sessionId, {
      path: '/', // any route can access the cookies
      maxAge: 60 * 60 * 24 * 7, // 7 days to expire
    })

    await knex('users').insert({
      id: crypto.randomUUID(),
      session_id: sessionId,
      name,
      email,
    })

    return reply.status(201).send()
  })
}

export default usersRoutes
