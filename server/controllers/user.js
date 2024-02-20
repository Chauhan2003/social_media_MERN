import User from "../models/user.js";
import bcrypt from 'bcrypt';
import { errorHandler } from "../utils/error.js";
import generateToken from "../utils/token.js";

export const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return next(errorHandler(400, "Enter all the fields"));
        }

        // Check if the user already exists
        let existingUser = await User.findOne({ email });

        if (existingUser) {
            return next(errorHandler(400, "User already exists"));
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            profileImg: {
                public_id: "sample_id",
                url: "sampleurl"
            }
        });

        const token = generateToken({
            userId: newUser._id
        });

        res.status(201).cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
            httpOnly: true
        }).json({
            success: true,
            newUser,
            token
        });
    } catch(err) {
        next(err);
    }
}

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(errorHandler(400, "Enter all the fields"));
        }

        // Find the user by email
        const userExist = await User.findOne({ email }).select("+password");

        // Check if the user exists
        if (!userExist) {
            return next(errorHandler(404, "User not found"));
        }
        
        // Compare passwords using bcrypt
        const validPassword = await bcrypt.compare(password, userExist.password);

        if (!validPassword) {
            return next(errorHandler(401, 'Wrong credentials!'));
        }

        const token = generateToken({
            userId: userExist._id
        });

        res.status(201).cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
            httpOnly: true
        }).json({
            success: true,
            userExist,
            token
        });
    } catch(err) {
        next(err);
    }
}