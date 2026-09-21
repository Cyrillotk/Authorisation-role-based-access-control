const bcrypt = require('bcrypt');
const User = require('../models/User');

const showRegister = (req, res) => {
  res.render('register');
};

const register = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).render('register', {
        error: 'All fields are required.'
      });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(400).render('register', {
        error: 'Username or email already exists.'
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      passwordHash,
      role: role || 'user'
    });

    req.session.user = {
      id: user._id,
      username: user.username,
      role: user.role
    };

    res.redirect('/dashboard');
  } catch (error) {
    next(error);
  }
};

const showLogin = (req, res) => {
  res.render('login');
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).render('login', {
        error: 'Invalid email or password.'
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatch) {
      return res.status(401).render('login', {
        error: 'Invalid email or password.'
      });
    }

    req.session.user = {
      id: user._id,
      username: user.username,
      role: user.role
    };

    res.redirect('/dashboard');
  } catch (error) {
    next(error);
  }
};

const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};

module.exports = {
  showRegister,
  register,
  showLogin,
  login,
  logout
};