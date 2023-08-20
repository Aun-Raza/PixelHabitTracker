import mongoose, { Schema, model } from 'mongoose';
import { IDay } from '../types';

const DaySchema = new Schema<IDay>({
  date: { type: String, required: true },
  habit: { type: Schema.Types.ObjectId, ref: 'Habit', required: true },
  checked: { type: Schema.Types.Boolean, required: true, default: false },
});

const DayModel = model<IDay>('Day', DaySchema);
export default DayModel;
