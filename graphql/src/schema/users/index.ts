import { gql } from "apollo-server";
import { Context } from "../../context";

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

export const resolvers = {
  Query: {
    currentUser,
  },
};
