import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

export const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
console.log(`Mongoose connect : ${conn.connection.host}`)
    } catch (error) {
        console.log("mongoose not connect",error)
    }
}