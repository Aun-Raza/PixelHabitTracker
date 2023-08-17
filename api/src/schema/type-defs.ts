import { gql } from 'apollo-server';

const typeDefs = gql`
  input loginInput {
    username: String!
    password: String!
  }

  type User {
    _id: String!
    username: String!
    points: Int!
    habits: [Habit!]
  }

  type UserWithToken {
    _id: String!
    username: String!
    points: Int!
    token: String!
    habits: [Habit!]
  }

  type Habit {
    _id: String!
    name: String!
    color: String!
    owner: User!
  }

  type Query {
    users: [User!]!
    login(input: loginInput): UserWithToken
  }

  type Mutation {
    register(input: loginInput): UserWithToken
    addHabit(name: String!, color: String!): Habit
  }
`;

export { typeDefs };
