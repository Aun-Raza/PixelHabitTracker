import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { IContext } from '../types';
dotenv.config();

const unprotectedOperations = ['loginUser', 'registerUser'];

const context = ({ req, res }: IContext) => {
  console.log('CONTEXT');
  const { operationName } = req.body;
  if (unprotectedOperations.includes(operationName)) return {};

  const { authorization } = req.headers;

  console.log(req.headers);

  if (!authorization)
    throw new GraphQLError('You need authentication to access this');

  let user;
  try {
    user = jwt.verify(authorization, process.env.JWT_SECRET || '');
  } catch (err) {
    throw new GraphQLError('authentication token failed to be verified');
  }

  return { user, req, res };
};

export { context };
