import mongoose, { Schema, model } from 'mongoose';
import { IDate } from '../types';

const DateSchema = new Schema<IDate>({
  date: { type: String, required: true },
  habit: { type: Schema.Types.ObjectId, ref: 'Habit', required: true },
  checked: { type: Schema.Types.Boolean, required: true, default: false },
});

const DateModel = model<IDate>('Date', DateSchema);
export default DateModel;
