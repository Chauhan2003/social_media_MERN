import express from 'express';
import { followUser, loginUser, registerUser } from '../controllers/user.js';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

router.route('/login').post(loginUser);
router.route('/register').post(registerUser);
router.route('/follow/:id').get(isAuth, followUser);

export default router;