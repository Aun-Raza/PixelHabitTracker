import mongoose, { Schema, model } from 'mongoose';

interface IDate {
  date: Date;
  habit: Schema.Types.ObjectId;
}

const DateSchema = new Schema<IDate>({
  date: { type: Date, required: true },
  habit: { type: Schema.Types.ObjectId, ref: 'Habit', required: true },
});

const DateModel = model<IDate>('Date', DateSchema);
export default DateModel;
