const express = require('express');

const {
  dashboard,
  manageUsers
} = require('../controllers/userController');

const requireAuth = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/dashboard', requireAuth, dashboard);

router.get(
  '/admin/users',
  requireRole('admin'),
  manageUsers
);

router.get(
  '/staff',
  requireRole('admin', 'staff'),
  (req, res) => {
    res.send('Welcome to the staff area');
  }
);

module.exports = router;