import mongoose, { Schema, model } from 'mongoose';

interface IHabit {
  name: string;
  color: string;
  owner: Schema.Types.ObjectId;
  dates: Schema.Types.ObjectId[];
}

const HabitSchema = new Schema<IHabit>(
  {
    name: { type: String, required: true },
    color: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    dates: { type: [Schema.Types.ObjectId], ref: 'Date', required: true },
  },
  { timestamps: true }
);

const HabitModel = model<IHabit>('Habit', HabitSchema);
export default HabitModel;
