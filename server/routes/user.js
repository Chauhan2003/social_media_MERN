import express from 'express';
import { followUser, logOut, loginUser, registerUser } from '../controllers/user.js';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

router.route('/login').post(loginUser);
router.route('/register').post(registerUser);
router.route('/logout').get(isAuth, logOut);
router.route('/follow/:id').get(isAuth, followUser);

export default router;