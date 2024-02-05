import fastify from 'fastify'
import mealsRoutes from './routes/meals/meals'
import usersRoutes from './routes/users/users'
import fastifyCookie from '@fastify/cookie'

export const app = fastify()

app.register(fastifyCookie)

app.register(mealsRoutes, {
  prefix: 'meals',
})

app.register(usersRoutes, {
  prefix: 'users',
})
