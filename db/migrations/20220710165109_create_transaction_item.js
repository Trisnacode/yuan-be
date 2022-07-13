exports.up = function(knex) {
  return knex.schema.createTable('TransactionItem', (table) => {
    table.increments('id');
    table.string('name');
    table.integer('qty');
    table.integer('price');
    table.jsonb('item_data');

    table.integer('transaction_id').unsigned().references('id').inTable('Transaction').onDelete('CASCADE');

    // timestamp
    table.timestamp('created_at', {precision: 6}).defaultTo(knex.fn.now(6));
    table.timestamp('updated_at', {precision: 6}).defaultTo(knex.fn.now(6));
    table.datetime('deleted_at');
  });
};


exports.down = function(knex) {
  return knex.schema.dropTableIfExists('TransactionItem');
};
