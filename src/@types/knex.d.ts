// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  // <----- Different module path!!!
  interface Meals {
    id: string
    user_id: string
    title: string
    description: string
    isOnDiet: boolean
    created_at: string
    updated_at: string
  }

  export interface Users {
    id: string
    session_id: string
    created_at: string
    name: string
    email: string
  }

  interface Tables {
    meals: Meals
    users: Users
  }
}
