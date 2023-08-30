import { UserModel, HabitModel, DayModel } from '../models';
import _ from 'lodash';
import { connectToDb } from '../utils/database';
import {
  IContextWithUser,
  IDay,
  IHabit,
  IHabitWithDays,
  IUser,
} from '../types';
import { GraphQLError, GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { updateHabitDays } from './helper';
dayjs.extend(customParseFormat);
dotenv.config();
const saltRounds = 5;
const salt = bcrypt.genSaltSync(saltRounds);
const POINT = 1;

const resolvers = {
  Query: {
    users: async (parent: any, args: null, { user }: IContextWithUser) => {
      await connectToDb();
      const allUsers = await UserModel.find();

      return _.map(allUsers, (user) =>
        _.pick(user, ['_id', 'username', 'points', 'habits'])
      );
    },

    user: async (parent: any, args: null, { user }: IContextWithUser) => {
      await connectToDb();
      const foundUser = await UserModel.findById(user._id);

      if (!foundUser) {
        throw new GraphQLError(`${user.username} cannot be found`);
      }

      return _.pick(foundUser, ['_id', 'username', 'points', 'habits']);
    },

    habits: async (parent: any, args: null, { user }: IContextWithUser) => {
      await connectToDb();
      const allHabits = await HabitModel.find({ owner: user._id });

      _.forEach(allHabits, async (habit) => {
        const habitWithDays = (await habit.populate('days')) as IHabitWithDays;
        await updateHabitDays(habitWithDays);
      });

      const allUpdatedHabits = await HabitModel.find({ owner: user._id });
      return allUpdatedHabits;
    },

    points: async (parent: any, args: null, { user }: IContextWithUser) => {
      const userDoc = await UserModel.findById(user._id);
      return userDoc?.points;
    },
  },

  Mutation: {
    register: async (
      parent: any,
      args: { input: { username: string; password: string } }
    ) => {
      await connectToDb();
      const { username, password } = args.input;

      const foundUser = await UserModel.findOne({ username });

      if (foundUser) {
        throw new GraphQLError(`${username} already registered`);
      }

      const newUser: IUser = {
        username,
        hash: bcrypt.hashSync(password, salt),
        points: 0,
        habits: [],
      };

      const userDoc = await UserModel.create(newUser);

      const token = jwt.sign(
        { _id: userDoc._id, username },
        process.env.JWT_SECRET || ''
      );

      return Object.assign(
        _.pick(userDoc, ['_id', 'username', 'points', 'habits']),
        {
          token,
        }
      );
    },

    login: async (
      parent: any,
      args: { input: { username: string; password: string } }
    ) => {
      await connectToDb();
      const { username, password } = args.input;
      const foundUser = await UserModel.findOne({ username });

      if (!foundUser) throw new GraphQLError(`Could not find ${username})`);

      if (!bcrypt.compareSync(password, foundUser.hash))
        throw new GraphQLError(`Passwords do not match`);

      const token = jwt.sign(
        { _id: foundUser._id, username },
        process.env.JWT_SECRET || ''
      );

      return Object.assign(
        _.pick(foundUser, ['_id', 'username', 'points', 'habits']),
        {
          token,
        }
      );
    },

    addHabit: async (
      parent: any,
      args: { name: string; color: string },
      { user }: IContextWithUser
    ) => {
      await connectToDb();
      const { name, color } = args;

      const habitDoc = await HabitModel.create({
        name,
        color,
        owner: user._id,
        dates: [],
      });

      const dayDoc = await DayModel.create({
        date: dayjs().format('MM-DD-YYYY'),
        habit: habitDoc._id,
        checked: false,
      });

      habitDoc.days.push(dayDoc._id);
      await habitDoc.save();

      const userDoc = await UserModel.findById(user._id);
      userDoc?.habits.push(habitDoc._id);
      await userDoc?.save();
      return _.pick(habitDoc, ['_id', 'name', 'color', 'owner']);
    },

    editHabit: async (
      parent: any,
      {
        habitId,
        name,
        color,
      }: { habitId: string; name: string; color: string },
      { user }: IContextWithUser
    ) => {
      await connectToDb();

      const habitDoc = await HabitModel.findById(habitId);

      if (!habitDoc) {
        throw new GraphQLError(`habit does not exist`);
      }

      habitDoc.name = name;
      habitDoc.color = color;
      await habitDoc.save();

      return _.pick(habitDoc, ['_id', 'name', 'color', 'owner']);
    },

    deleteHabit: async (
      parent: any,
      { habitId }: { habitId: string },
      { user }: IContextWithUser
    ) => {
      await connectToDb();

      const habitDoc = await HabitModel.findById(habitId);

      if (!habitDoc) {
        throw new GraphQLError(`habit does not exist`);
      }

      await HabitModel.findByIdAndDelete(habitDoc._id);
      await DayModel.deleteMany({ habit: habitDoc._id });

      const userDoc = await UserModel.findById(user._id);
      userDoc?.habits.filter((habit) => habit._id !== habitDoc._id);
      await userDoc?.save();

      return _.pick(habitDoc, ['_id', 'name', 'color', 'owner']);
    },

    checkHabitDay: async (
      parent: any,
      { dayId }: { dayId: string },
      { user }: IContextWithUser
    ) => {
      await connectToDb();

      const dayDoc = await DayModel.findById(dayId);

      if (!dayDoc) {
        throw new GraphQLError(`day does not exist`);
      }

      dayDoc.checked = !dayDoc.checked;
      await dayDoc.save();

      const userDoc = await UserModel.findById(user._id);

      if (!userDoc) {
        throw new GraphQLError(`user does not exist`);
      }

      userDoc.points += dayDoc.checked ? POINT : -POINT;
      await userDoc.save();

      return _.pick(dayDoc, ['_id', 'date', 'habit', 'checked']);
    },
  },

  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Custom description for the date scalar',
    parseValue(value: any) {
      return dayjs(value);
    },
    serialize(value: any) {
      return dayjs(value).format('MM-DD-YYYY');
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return dayjs(ast.value);
      }
      return null;
    },
  }),

  User: {
    habits: async (user: IUser) => {
      await connectToDb();
      const freshUser = await UserModel.findById(user._id).populate('habits');
      if (!freshUser) return null;
      return freshUser.habits;
    },
  },

  UserWithToken: {
    habits: async (user: IUser) => {
      await connectToDb();
      const freshUser = await UserModel.findById(user._id).populate('habits');
      if (!freshUser) return null;
      return freshUser.habits;
    },
  },

  Habit: {
    owner: async (habit: IHabit) => {
      await connectToDb();
      const freshHabit = await HabitModel.findById(habit).populate('owner');
      if (!freshHabit) return null;
      return freshHabit.owner;
    },
    days: async (habit: IHabit) => {
      await connectToDb();
      const freshHabit = await HabitModel.findById(habit).populate('days');
      if (!freshHabit) return null;
      return freshHabit.days;
    },
  },

  Day: {
    habit: async (day: IDay) => {
      await connectToDb();
      const freshDay = await DayModel.findById(day._id).populate('habit');
      if (!freshDay) return null;
      return freshDay.habit;
    },
  },
};

export { resolvers };
