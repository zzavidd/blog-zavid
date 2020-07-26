const express = require('express');
const router = express.Router();

const PostController = require('../controllers/posts.controller');

/** GET all posts */
router.get('/', PostController.getAllPosts);

module.exports = router;