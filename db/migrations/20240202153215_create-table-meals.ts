import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (meals) => {
    meals.uuid('id').unique().primary().index()
    meals.uuid('user_id').references('users.id').notNullable()
    meals.text('title').notNullable()
    meals.text('description').notNullable()
    meals.boolean('isOnDiet').notNullable()
    meals.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    meals.timestamp('updated_at').defaultTo(null)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
