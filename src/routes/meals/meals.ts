import crypto from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { knex } from '../../database'
import { z } from 'zod'
import checkIfUserExists from '../../middlewares/check-if-user-exists'

async function mealsRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: checkIfUserExists }, async (req) => {
    const meals = await knex('meals')
      .where('user_id', req.user?.id)
      .orderBy('created_at', 'desc')

    return { meals }
  })

  app.get('/:id', { preHandler: checkIfUserExists }, async (req, reply) => {
    const getMealsParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getMealsParamsSchema.parse(req.params)

    const meal = await knex('meals').where('id', id).first()

    if (!meal) {
      return reply.status(404).send({ error: 'Meal not found' })
    }

    return reply.send({ meal })
  })

  app.put('/:id', { preHandler: checkIfUserExists }, async (req, reply) => {
    const getMealsParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const getMealsBodySchema = z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      isOnDiet: z.boolean().optional(),
    })

    const { id } = getMealsParamsSchema.parse(req.params)
    const { title, description, isOnDiet } = getMealsBodySchema.parse(req.body)

    const mealUpdated = await knex('meals').where('id', id).update(
      {
        title,
        description,
        isOnDiet,
        updated_at: knex.fn.now(),
      },
      ['id', 'title', 'description', 'isOnDiet', 'updated_at'],
    )

    if (!mealUpdated.length) {
      return reply.status(400).send({ error: 'Meal not found' })
    }

    return reply.status(204).send({ mealUpdated })
  })

  app.delete('/:id', { preHandler: checkIfUserExists }, async (req, reply) => {
    const getMealsParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getMealsParamsSchema.parse(req.params)

    const meal = await knex('meals').where('id', id).del()

    if (!meal) {
      return reply.status(400).send({
        error: 'Meal not found',
      })
    }

    return reply.status(204).send()
  })

  app.post('/', { preHandler: checkIfUserExists }, async (req, reply) => {
    const createMealsBodySchema = z.object({
      title: z.string(),
      description: z.string(),
      isOnDiet: z.boolean(),
    })

    const body = createMealsBodySchema.parse(req.body)
    const userId = req.user?.id

    const { title, description, isOnDiet } = body

    await knex('meals').insert({
      id: crypto.randomUUID(),
      user_id: userId,
      title,
      description,
      isOnDiet,
    })

    return reply.status(201).send('Meals created')
  })

  app.get(
    '/metrics',
    { preHandler: [checkIfUserExists] },
    async (req, reply) => {
      const totalMeals = await knex('meals')
        .where({ user_id: req.user?.id })
        .count('id', { as: 'total' })
        .first()

      const totalMealsOnDiet = await knex('meals')
        .where({
          user_id: req.user?.id,
          isOnDiet: true,
        })
        .count('id', { as: 'total' })
        .first()

      const totalMealsOffDiet = await knex('meals')
        .where({
          user_id: req.user?.id,
          isOnDiet: false,
        })
        .count('id', { as: 'total' })
        .first()

      const onDietArray = await knex
        .select('isOnDiet')
        .from('meals')
        .where({ user_id: req.user?.id })

      const bestOnDietSequence = onDietArray.reduce(
        (obj, meal) => {
          if (meal.isOnDiet) {
            obj.currentSequence += 1
          } else {
            obj.currentSequence = 0
          }

          if (obj.currentSequence > obj.bestSequence) {
            obj.bestSequence = obj.currentSequence
          }

          return obj
        },
        { bestSequence: 0, currentSequence: 0 },
      )

      return reply.send([
        {
          totalMeals: totalMeals?.total,
          totalMealsOnDiet: totalMealsOnDiet?.total,
          totalMealsOffDiet: totalMealsOffDiet?.total,
          bestOnDietSequence: bestOnDietSequence.bestSequence,
        },
      ])
    },
  )
}

export default mealsRoutes
