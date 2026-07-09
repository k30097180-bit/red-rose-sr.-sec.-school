import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const MONGO_URI = String(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/redrose-school').trim();

export async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  mongoose.set('strictQuery', false);

  return mongoose.connect(MONGO_URI, {
    autoIndex: true,
    serverSelectionTimeoutMS: 10000
  });
}
