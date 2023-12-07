const db = require('../../data/dbConfig.js');
const bcrypt = require('bcryptjs');

function find() {
  return db('users').select('id', 'username');
}

function findBy(filter) {
  return db('users').where(filter);
}

function findById(id) {
  return db('users').where({ id }).first();
}

async function add(user) {
  const [id] = await db('users').insert(user, 'id');
  return findById(id);
}

async function createUserWithHashedPassword(username, password) {
  const hash = bcrypt.hashSync(password, 8);
  const newUser = { username, password: hash };
  return await add(newUser);
}

module.exports = {
  find,
  findBy,
  findById,
  add,
  createUserWithHashedPassword,
};
