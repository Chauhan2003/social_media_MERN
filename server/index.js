import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/user.js';
import cors from 'cors';
import Connection from './database/db.js';
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

// API:
app.use('/api/v1', userRoutes);

// Database:
Connection();

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})

// error handling:
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
})