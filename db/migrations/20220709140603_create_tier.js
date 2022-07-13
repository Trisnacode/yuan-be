exports.up = function(knex) {
  return knex.schema.createTable('Tier', function(table) {
    table.increments('id');
    table.string('title');
    table.string('image');
    table.string('description');

    table.integer('minimum_point');
    table.jsonb('tier_data');

    // timestamp
    table.timestamp('created_at', {precision: 6}).defaultTo(knex.fn.now(6));
    table.timestamp('updated_at', {precision: 6}).defaultTo(knex.fn.now(6));
    table.datetime('deleted_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('Tier');
};
