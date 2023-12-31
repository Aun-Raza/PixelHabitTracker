import mongoose, { Schema, model } from 'mongoose';
import { IHabit } from '../types';

const HabitSchema = new Schema<IHabit>(
  {
    name: { type: String, required: true },
    color: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    days: { type: [Schema.Types.ObjectId], ref: 'Day', required: true },
  },
  { timestamps: true }
);

const HabitModel = model<IHabit>('Habit', HabitSchema);
export default HabitModel;
