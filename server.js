import { config } from "dotenv"
config();
import express from 'express'
import connectDB from './config/db.js';
import mongoose from 'mongoose';
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.js" 
import errorHandler from "./middleware/error.js" 

const app = express();
const PORT = process.env.PORT || 8080;
connectDB()


// 미들웨어 등록.
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoutes);
app.use(errorHandler)
mongoose.connection.once('open',() => {
    console.log('몽고DB 연결 ✔️')
    app.listen(PORT, () => console.log('서버 시작 ✔️'));
})

mongoose.connection.on('error',() => {
    console.log('몽고DB 연결 실패 ❌')
})

