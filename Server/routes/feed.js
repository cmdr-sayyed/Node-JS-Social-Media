const router = require('express').Router();
const { body }  = require('express-validator/check')

const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth');

// GET/ feed/posts
router.get('/posts',isAuth, feedController.getPosts);

// POST /feed/post
router.post('/post',isAuth,[
    body('title').trim().isLength({min:5}),
    body('content').trim().isLength({min:5})
], feedController.createPost);

router.get('/post/:postId',isAuth, feedController.getPost);

// update post
router.put('/post/:postId',isAuth,feedController.updatePost);

// delete post 
router.delete('post/:postId',isAuth, feedController.deletePost);
module.exports = router;

