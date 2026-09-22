//for implementing search,filtering ,sorting and pagination task    
const express = require('express');

const {
  getPosts,
  showCreatePost,
  createPost,
  showEditPost,
  updatePost,
  deletePost
} = require('../controllers/postController');

const requireAuth = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/posts', requireAuth, getPosts);

router.get(
  '/posts/create',
  requireAuth,
  showCreatePost
);

router.post(
  '/posts',
  requireAuth,
  createPost
);

router.get(
  '/posts/:id/edit',
  requireAuth,
  showEditPost
);

router.post(
  '/posts/:id/update',
  requireAuth,
  updatePost
);

router.post(
  '/posts/:id/delete',
  requireRole('admin', 'staff'),
  deletePost
);

module.exports = router;