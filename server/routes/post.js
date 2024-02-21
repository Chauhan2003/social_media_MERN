import express from 'express';
import { isAuth } from '../middleware/auth.js';
import { createPost, deletePost, toggleLike } from '../controllers/post.js';

const router = express.Router();

router.route('/post/upload').post(isAuth, createPost);
router.route('/post/:id').get(isAuth, toggleLike).delete(isAuth, deletePost);

export default router;