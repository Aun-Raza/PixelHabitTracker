import { gql } from 'apollo-server';

const typeDefs = gql`
  scalar Date

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
    days: [Day!]
  }

  type Day {
    _id: String!
    date: Date!
    habit: Habit!
    checked: Boolean!
  }

  type Query {
    users: [User!]!
    login(input: loginInput): UserWithToken
    tomorrow: Date!
    yesterday: Date!
  }

  type Mutation {
    register(input: loginInput): UserWithToken
    addHabit(name: String!, color: String!): Habit
    deleteHabit(habitId: String!): String
    addNDays(habitId: String!, num: Int!): String
  }
`;

export { typeDefs };
