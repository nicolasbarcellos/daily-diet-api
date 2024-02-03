import 'fastify'
import { Users } from 'knex/types/tables'

declare module 'fastify' {
  export interface FastifyRequest {
    user?: Users
  }
}
