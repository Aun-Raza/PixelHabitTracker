import { UserModel, HabitModel, DayModel } from '../models';
import _ from 'lodash';
import { connectToDb } from '../utils/database';
import { IContextWithUser, IDay, IHabit, IUser } from '../types';
import { GraphQLError, GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import dayjs from 'dayjs';
dotenv.config();
const saltRounds = 5;
const salt = bcrypt.genSaltSync(saltRounds);

const resolvers = {
  Query: {
    users: async (parent: any, args: null, { user }: IContextWithUser) => {
      await connectToDb();
      const allUsers = await UserModel.find();

      return _.map(allUsers, (user) =>
        _.pick(user, ['_id', 'username', 'points', 'habits'])
      );
    },

    tomorrow: (_: any) => {
      const formattedDate = dayjs(Date.now());
      return formattedDate.add(1, 'day');
    },
    yesterday: (_: any) => {
      const formattedDate = dayjs(Date.now());
      return formattedDate.subtract(1, 'day');
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

      return Object.assign(_.pick(userDoc, ['_id', 'username', 'points']), {
        token,
      });
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

      const userDoc = await UserModel.findById(user._id);
      userDoc?.habits.push(habitDoc._id);
      await userDoc?.save();
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

      return 'Success';
    },

    addNDays: async (
      parent: any,
      { habitId, num }: { habitId: string; num: number }
    ) => {
      await connectToDb();
      const habitDoc = await HabitModel.findById(habitId);

      if (!habitDoc) {
        throw new GraphQLError(`habit need to exist to add days`);
      }

      const dayCurrent = dayjs(Date.now());
      const dayLastWeek = dayjs(Date.now()).subtract(num - 1, 'day');

      const foundHabitDay = await DayModel.findOne({
        $or: [
          { date: dayCurrent.format('MM-DD-YYYY'), habit: habitDoc._id },
          { date: dayLastWeek.format('MM-DD-YYYY'), habit: habitDoc._id },
        ],
      });

      if (foundHabitDay) {
        throw new GraphQLError(`cannot duplicate habit days`);
      }

      let currentDay = dayLastWeek;
      while (currentDay.isBefore(dayCurrent) || currentDay.isSame(dayCurrent)) {
        const dayDoc = await DayModel.create({
          date: currentDay.format('MM-DD-YYYY'),
          habit: habitId,
          checked: false,
        });
        habitDoc.days.push(dayDoc._id);
        await habitDoc.save();
        currentDay = currentDay.add(1, 'day');
      }

      return 'Success';
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
