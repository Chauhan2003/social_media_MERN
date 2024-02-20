import express from 'express';
import { isAuth } from '../middleware/auth.js';
import { createPost, toggleLike } from '../controllers/post.js';

const router = express.Router();

router.route('/post/upload').post(isAuth, createPost);
router.route('/post/:id').post(isAuth, toggleLike);

export default router;