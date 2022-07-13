exports.up = function(knex) {
  return knex.schema.createTable('User', function(table) {
    table.increments('id');
    table.string('name').notNullable();
    table.string('phone');
    table.string('email').notNullable();
    table.string('password').notNullable();

    table.string('token');

    // timestamp
    table.timestamp('created_at', {precision: 6}).defaultTo(knex.fn.now(6));
    table.timestamp('updated_at', {precision: 6}).defaultTo(knex.fn.now(6));
    table.datetime('deleted_at');
  });
};


exports.down = function(knex) {
  return knex.schema.dropTableIfExists('User');
};
