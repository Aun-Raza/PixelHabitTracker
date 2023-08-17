import { UserModel, HabitModel } from '../models';
import _ from 'lodash';
import { connectToDb } from '../utils/database';
import { IContextWithUser, IHabit, IUser } from '../types';
import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { Document } from 'mongoose';
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

    addHabit: async (
      parent: any,
      args: { name: string; color: string },
      { user }: IContextWithUser
    ) => {
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
  },

  User: {
    habits: async (user: IUser) => {
      const freshUser = await UserModel.findById(user._id).populate('habits');
      if (!freshUser) return null;
      return freshUser.habits;
    },
  },

  UserWithToken: {
    habits: async (user: IUser) => {
      const freshUser = await UserModel.findById(user._id).populate('habits');
      if (!freshUser) return null;
      return freshUser.habits;
    },
  },

  Habit: {
    owner: async (habit: IHabit) => {
      const freshHabit = await HabitModel.findById(habit).populate('owner');
      if (!freshHabit) return null;
      return freshHabit.owner;
    },
  },
};

export { resolvers };
