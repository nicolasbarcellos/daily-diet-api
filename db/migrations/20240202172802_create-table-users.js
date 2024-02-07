"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    await knex.schema.createTable('users', (users) => {
        users.uuid('id').unique().primary().index();
        users.uuid('session_id').notNullable().index();
        users.text('name').notNullable();
        users.text('email').notNullable().unique();
        users.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    });
}
exports.up = up;
async function down(knex) {
    await knex.schema.dropTable('users');
}
exports.down = down;
