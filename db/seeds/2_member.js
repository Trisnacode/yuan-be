const SALT = parseInt(process.env.SALT) || process.env.SALT;
const bcrypt = require('bcrypt');

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('Member').del();
  await knex('Member').insert([
    {id: 1, email: 'test@gmail.com', phone: '6281234567890', password: bcrypt.hashSync('password', SALT), tier_id: 1},
  ]);
};
