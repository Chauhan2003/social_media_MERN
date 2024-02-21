import express from 'express';
import { isAuth } from '../middleware/auth.js';
import { createPost, deletePost, getPostOfFollowing, toggleLike } from '../controllers/post.js';

const router = express.Router();

router.route('/post/upload').post(isAuth, createPost);
router.route('/post/:id').get(isAuth, toggleLike).delete(isAuth, deletePost);
router.route('/posts').get(isAuth, getPostOfFollowing);

export default router;