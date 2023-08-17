import mongoose, { Schema, model } from 'mongoose';
import { IUser } from '../types';

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    hash: { type: String, required: true },
    points: { type: Number, required: true },
    habits: { type: [Schema.Types.ObjectId], ref: 'Habit', required: true },
  },
  { timestamps: true }
);

const UserModel = model<IUser>('User', UserSchema);
export default UserModel;
