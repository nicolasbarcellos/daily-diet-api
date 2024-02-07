"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    await knex.schema.createTable('meals', (meals) => {
        meals.uuid('id').unique().primary().index();
        meals.uuid('user_id').references('users.id').notNullable();
        meals.text('title').notNullable();
        meals.text('description').notNullable();
        meals.boolean('isOnDiet').notNullable();
        meals.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
        meals.timestamp('updated_at').defaultTo(null);
    });
}
exports.up = up;
async function down(knex) {
    await knex.schema.dropTable('meals');
}
exports.down = down;
