import { gql } from "apollo-server";
import { Context } from "../../context";
import { UserService } from "../../services/user";

/**
 * Type Defs
 */

export const typeDefs = gql`
  enum UserRole {
    ADMIN
    MENTOR_TEACHER
    TUTOR_TEACHER
  }

  enum AccountStatus {
    ACTIVE
    PENDING
    DISABLED
  }

  type User {
    email: String!
    role: UserRole!
    accountStatus: AccountStatus!
  }

  type Query {
    currentUser: User
    users: [User!]!
  }
`;

/**
 * Query Resolvers
 */

async function currentUser(
  _parent: undefined,
  _args: undefined,
  { authedUser }: Context
) {
  return authedUser;
}

async function users(
  _parent: undefined,
  _args: undefined,
  { authedUser }: Context
) {
  //TODO: check if user is an authorized admin.
  return UserService.getUsers(10);
}

export const resolvers = {
  Query: {
    currentUser,
    users,
  },
};
