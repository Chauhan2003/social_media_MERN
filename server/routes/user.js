import express from 'express';
import { loginUser, registerUser } from '../controllers/user.js';

const router = express.Router();

router.route('/login').post(loginUser);
router.route('/register').post(registerUser);

export default router;