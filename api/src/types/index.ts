import mongoose, { model } from 'mongoose';

export interface IUser {
  _id?: mongoose.Types.ObjectId;
  username: string;
  hash: string;
  points: number;
  habits: mongoose.Types.ObjectId[];
}

export interface IHabit {
  _id?: mongoose.Types.ObjectId;
  name: string;
  color: string;
  owner: mongoose.Types.ObjectId;
  dates: mongoose.Types.ObjectId[];
}

export interface IDate {
  _id?: mongoose.Types.ObjectId;
  date: string;
  habit: mongoose.Types.ObjectId;
  checked: boolean;
}

export interface IContext {
  req: {
    headers: {
      authorization: string | undefined;
    };
    body: {
      operationName: string;
    };
  };
  res: {};
}

export interface IContextWithUser extends IContext {
  user: { _id: string; username: string };
}
