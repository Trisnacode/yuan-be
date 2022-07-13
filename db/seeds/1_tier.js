exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('Tier').del();
  await knex('Tier').insert([
    {id: 1, title: 'BASIC', description: '', minimum_point: 0},
    {id: 2, title: 'SILVER', description: '', minimum_point: 100},
  ]);
};
