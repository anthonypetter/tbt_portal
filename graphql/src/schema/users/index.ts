import { MutationInviteUserArgs } from "@generated/graphql";
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
    id: String!
    email: String!
    fullName: String!
    role: UserRole!
    accountStatus: AccountStatus!
    inviteSentAt: Date
  }

  input InviteUserInput {
    email: String!
    fullName: String!
    role: UserRole!
  }

  extend type Query {
    currentUser: User
    users: [User!]!
  }

  extend type Mutation {
    inviteUser(input: InviteUserInput!): User!
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
  { authedUser, UserService, AuthorizationService }: Context
) {
  AuthorizationService.assertIsAdmin(authedUser);
  return UserService.getUsers();
}

/**
 * Mutation Resolvers
 */

async function inviteUser(
  _parent: undefined,
  { input }: MutationInviteUserArgs,
  { authedUser, UserService, AuthorizationService }: Context
) {
  AuthorizationService.assertIsAdmin(authedUser);
  const { email, role, fullName } = input;

  return UserService.inviteUser({ email, fullName, role });
}

export const resolvers = {
  Query: {
    currentUser,
    users,
  },
  Mutation: {
    inviteUser,
  },
};
