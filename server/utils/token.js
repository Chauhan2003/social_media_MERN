import jwt from 'jsonwebtoken';

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET)
}

export default generateToken;