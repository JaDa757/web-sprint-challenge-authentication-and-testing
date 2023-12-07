const db = require('../../data/dbConfig.js');

function find() {
  return db('users').select('id', 'username');
}

function findBy(filter) {
  return db('users').where(filter);
}

function findById(id) {
  return db('users').where({ id }).first();
}

function add(user) {
  return db('users').insert(user, 'id').then(([id]) => findById(id));
}

module.exports = {
  find,
  findBy,
  findById,
  add,
};
