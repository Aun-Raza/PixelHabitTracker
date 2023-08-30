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
    user: User
    users: [User!]!
    habits: [Habit!]
    points: Int!
  }

  type Mutation {
    login(input: loginInput): UserWithToken
    register(input: loginInput): UserWithToken
    addHabit(name: String!, color: String!): Habit
    deleteHabit(habitId: String!): Habit
    editHabit(habitId: String!, name: String!, color: String!): Habit
    checkHabitDay(dayId: String!): Day
  }
`;

export { typeDefs };
