exports.up = function(knex) {
  return knex.schema.createTable('Voucher', function(table) {
    table.increments('id');
    table.string('title').notNullable();
    table.string('description');
    table.string('tnc');
    table.string('code').unique(); // empty if voucher for specific user
    table.string('image');

    table.integer('required_point');
    table.integer('discount_amount'); // for fix amount
    table.integer('discount_percent'); // for percent amount
    table.integer('minimum_spending');

    table.integer('quantity'); // maximumm quantity
    table.integer('remaining'); // remaining quantity

    table.boolean('is_buyable').defaultTo(false);
    table.date('expired_at'); // expiry date
    table.boolean('is_active').defaultTo(true); // is voucher active

    table.jsonb('data');
    // timestamp
    table.timestamp('created_at', {precision: 6}).defaultTo(knex.fn.now(6));
    table.timestamp('updated_at', {precision: 6}).defaultTo(knex.fn.now(6));
    table.datetime('deleted_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('Voucher');
};
