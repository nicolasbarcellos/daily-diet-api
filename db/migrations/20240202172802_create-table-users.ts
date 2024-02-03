import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (users) => {
    users.uuid('id').unique().primary().index()
    users.uuid('session_id').notNullable().index()
    users.text('name').notNullable()
    users.text('email').notNullable().unique()
    users.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')
}
