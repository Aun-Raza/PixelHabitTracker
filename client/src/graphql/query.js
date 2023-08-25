import { gql } from '@apollo/client';

export const QUERY_ALL_USERS = gql`
  query GetAllUser {
    users {
      username
      points
    }
  }
`;

export const QUERY_ALL_HABITS = gql`
  query habits {
    habits {
      _id
      name
      color
      days {
        _id
        date
        checked
        habit {
          _id
        }
      }
    }
  }
`;

export const ADD_HABIT = gql`
  mutation addHabit($name: String!, $color: String!) {
    addHabit(name: $name, color: $color) {
      _id
      name
      color
      days {
        _id
        date
        checked
        habit {
          _id
        }
      }
    }
  }
`;

export const EDIT_HABIT = gql`
  mutation editHabit($habitId: String!, $name: String!, $color: String!) {
    editHabit(habitId: $habitId, name: $name, color: $color) {
      _id
      name
      color
    }
  }
`;

export const CHECK_DAY = gql`
  mutation checkHabitDay($dayId: String!) {
    checkHabitDay(dayId: $dayId) {
      _id
      date
      checked
    }
  }
`;

export const DELETE_HABIT = gql`
  mutation deleteHabit($habitId: String!) {
    deleteHabit(habitId: $habitId) {
      _id
    }
  }
`;

export const LOGIN_USER = gql`
  mutation loginUser($input: loginInput) {
    login(input: $input) {
      username
      points
      token
      habits {
        _id
        name
        days {
          _id
          date
          checked
        }
      }
    }
  }
`;

export const REGISTER_USER = gql`
  mutation registerUser($input: loginInput) {
    register(input: $input) {
      username
      points
      token
      habits {
        _id
        name
        days {
          _id
          date
          checked
        }
      }
    }
  }
`;
