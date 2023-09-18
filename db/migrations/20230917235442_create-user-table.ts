import { Knex } from 'knex';
import { randomUUID } from 'node:crypto';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().notNullable();
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
  });

  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary().notNullable();
    table.string('name').notNullable();
    table.string('description').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.boolean('in_diet').defaultTo(false).notNullable();
    table.uuid('user_id').references('id').inTable('users').notNullable();
  });

  await knex.schema.createTable('sessions', (table) => {
    table.uuid('id').primary().notNullable();
    table.string('token').unique().notNullable();
    table.uuid('user_id').unsigned().notNullable();
    table.foreign('user_id').references('id').inTable('users');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('sessions');
  await knex.schema.dropTable('meals');
  await knex.schema.dropTable('users');
}
