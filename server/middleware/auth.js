import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';

export const isAuth = async (req, res, next) => {
    try{
        const { token } = req.cookies;
        if(!token) return next(errorHandler(401, "Please login first"));

        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId);
        
        next();
    } catch(err){
        next(err);
    }
}