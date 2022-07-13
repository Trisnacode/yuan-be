exports.up = function(knex) {
  return knex.schema.createTable('MemberVoucher', function(table) {
    table.increments('id');
    table.integer('member_id').unsigned().references('id').inTable('Member').onDelete('CASCADE');
    table.integer('voucher_id').unsigned().references('id').inTable('Voucher').onDelete('CASCADE');

    table.string('code').unique().notNullable();
    table.boolean('is_active').defaultTo(true);
    table.datetime('expired_at');

    table.datetime('burned_at');
    table.jsonb('data');

    // timestamp
    table.timestamp('created_at', {precision: 6}).defaultTo(knex.fn.now(6));
    table.timestamp('updated_at', {precision: 6}).defaultTo(knex.fn.now(6));
    table.datetime('deleted_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('MemberVoucher');
};
