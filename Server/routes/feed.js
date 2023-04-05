const router = require('express').Router();
const { body }  = require('express-validator/check')

const feedController = require('../controllers/feed')

// GET/ feed/posts
router.get('/posts', feedController.getPosts);

// POST /feed/post
router.post('/post',[
    body('title').trim().isLength({min:5}),
    body('content').trim().isLength({min:5})
], feedController.createPost);

router.get('/post/:postId', feedController.getPost);

module.exports = router;