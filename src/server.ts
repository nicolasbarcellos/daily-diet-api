import 'dotenv/config'
import fastify from 'fastify'
import mealsRoutes from './routes/meals/meals'
import usersRoutes from './routes/users/users'
import fastifyCookie from '@fastify/cookie'

const app = fastify()

app.register(fastifyCookie)

app.register(mealsRoutes, {
  prefix: 'meals',
})

app.register(usersRoutes, {
  prefix: 'users',
})

app
  .listen({
    port: 3333,
  })
  .then(() => console.log('server is running'))
