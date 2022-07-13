exports.up = function(knex) {
  return knex.schema.createTable('Transaction', (table) => {
    table.increments('id');
    table.integer('member_id').unsigned().references('id').inTable('Member');
    table.enu('type', ['HOTEL', 'OUTLET']);
    table.string('invoice');
    // hotel specialist
    table.integer('number_of_people');

    // outlet specialist
    table.integer('store_id');
    table.integer('split_number');

    table.integer('total_value');
    table.integer('tax');
    table.integer('service');
    table.integer('discount');

    table.datetime('opened_at');
    table.datetime('closed_at');

    table.datetime('done_at');
    table.jsonb('transaction_data');

    // timestamp
    table.timestamp('created_at', {precision: 6}).defaultTo(knex.fn.now(6));
    table.timestamp('updated_at', {precision: 6}).defaultTo(knex.fn.now(6));
    table.datetime('deleted_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('Transaction');
};
