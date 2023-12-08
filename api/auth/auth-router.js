const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = require('express').Router();
const Users = require('../users/users-model.js');
const { JWT_SECRET } = require('../../config');

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'username and password required' });
  }

  try {
    const existingUser = await Users.findBy({ username });
    // console.log('find existing user', existingUser)
    if (existingUser) {
      res.status(400).json({ message: 'username taken' });

    }

    const newUser = await Users.createUserWithHashedPassword(username, password);
    console.log('newuser', newUser)

    res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      password: newUser.password,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});


router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'username and password required' });
  }

  try {
    const [user] = await Users.findBy({ username });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'invalid credentials' });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: `welcome, ${user.username}`,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };
  const options = {
    expiresIn: '1d',
  };
  return jwt.sign(payload, JWT_SECRET, options);
}

module.exports = router;
