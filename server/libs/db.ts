import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.ATLAS_URI;
if (!uri) {
  throw new Error('ATLAS_URI is not defined in the environment');
}


const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(uri!);
    console.log(` ✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(` ✅ Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;