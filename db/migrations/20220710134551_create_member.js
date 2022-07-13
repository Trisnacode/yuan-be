exports.up = function(knex) {
  return knex.schema.createTable('Member', function(table) {
    table.increments('id');
    table.string('title');
    table.string('name');
    table.enu('gender', ['MALE', 'FEMALE']);
    table.string('email').notNullable();
    table.string('phone', 15).notNullable();
    table.string('password');
    table.string('address');
    table.string('country');
    table.string('city');
    table.date('birth_date');
    table.string('birth_place');
    table.string('food_preference');
    table.string('internal_preference');

    // member related
    table.integer('tier_id').nullable().unsigned().references('id').inTable('Tier');
    table.integer('total_point').defaultTo(0);
    table.integer('current_point').defaultTo(0);

    // token
    table.string('token');

    // timestamp
    table.timestamp('created_at', {precision: 6}).defaultTo(knex.fn.now(6));
    table.timestamp('updated_at', {precision: 6}).defaultTo(knex.fn.now(6));
    table.datetime('deleted_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('Member');
};
