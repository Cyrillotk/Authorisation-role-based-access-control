const User = require('../models/User');

const dashboard = (req, res) => {
  res.render('dashboard', {
    user: req.session.user
  });
};

const manageUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.render('users', {
      users
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  dashboard,
  manageUsers
};