const Post = require('../models/Post');

const getPosts = async (req, res, next) => {
  try {
    const {
      search = '',
      category = '',
      sort = 'newest',
      page = 1
    } = req.query;

    const limit = 5;
    const currentPage = Math.max(Number(page), 1);

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    let sortOption = { createdAt: -1 };

    if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    }

    if (sort === 'title') {
      sortOption = { title: 1 };
    }

    const totalPosts = await Post.countDocuments(query);

    const totalPages = Math.ceil(totalPosts / limit);

    const posts = await Post.find(query)
      .populate('owner', 'username email role')
      .sort(sortOption)
      .skip((currentPage - 1) * limit)
      .limit(limit);

    res.render('posts', {
      posts,
      search,
      category,
      sort,
      currentPage,
      totalPages,
      user: req.session.user
    });
  } catch (error) {
    next(error);
  }
};

const showCreatePost = (req, res) => {
  res.render('create-post');
};

const createPost = async (req, res, next) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content || !category) {
      return res.status(400).render('create-post', {
        error: 'All fields are required.'
      });
    }

    await Post.create({
      title,
      content,
      category,
      owner: req.session.user.id
    });

    res.redirect('/posts');
  } catch (error) {
    next(error);
  }
};

//adding ownership control 
const showEditPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).render('error', {
        message: 'Post not found.'
      });
    }

    if (
      post.owner.toString() !== req.session.user.id.toString() &&
      req.session.user.role !== 'admin'
    ) {
      return res.status(403).render('error', {
        message: 'You are not allowed to edit this post.'
      });
    }

    res.render('edit-post', { post });
  } catch (error) {
    next(error);
  }
};

//Update function
const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).render('error', {
        message: 'Post not found.'
      });
    }

    if (
      post.owner.toString() !== req.session.user.id.toString() &&
      req.session.user.role !== 'admin'
    ) {
      return res.status(403).render('error', {
        message: 'You are not allowed to update this post.'
      });
    }

    const { title, content, category } = req.body;

    post.title = title;
    post.content = content;
    post.category = category;

    await post.save();

    res.redirect('/posts');
  } catch (error) {
    next(error);
  }
};
//Delete function
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).render('error', {
        message: 'Post not found.'
      });
    }

    if (
      post.owner.toString() !== req.session.user.id.toString() &&
      req.session.user.role !== 'admin'
    ) {
      return res.status(403).render('error', {
        message: 'You are not allowed to delete this post.'
      });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.redirect('/posts');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPosts,
  showCreatePost,
  createPost,
  showEditPost,
  updatePost,
  deletePost
};