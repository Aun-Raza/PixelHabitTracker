import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

let isConnected = false;

export const connectToDb = async () => {
  mongoose.set('strictQuery', true);

  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI || '', {
      dbName: 'pixel_habit_tracker',
    });

    isConnected = true;
    console.log('MongoDB connected');
  } catch (error) {
    console.log(error);
  }
};
