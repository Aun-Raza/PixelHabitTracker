import { gql } from '@apollo/client';

export const QUERY_ALL_USERS = gql`
  query GetAllUser {
    users {
      username
      points
    }
  }
`;

export const LOGIN_USER = gql`
  mutation loginUser($input: loginInput) {
    login(input: $input) {
      username
      points
      token
    }
  }
`;
