import { gql } from "apollo-server";
import { Context } from "../../context";
import { InviteUserResonse, MutationInviteUserArgs } from "@generated/graphql";

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

  type InviteUserResonse {
    inviteSent: Boolean!
  }

  extend type Query {
    currentUser: User
    users: [User!]!
  }

  extend type Mutation {
    inviteUser(email: String!, role: UserRole!): InviteUserResonse!
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
  return UserService.getUsers(10);
}

async function inviteUser(
  _parent: undefined,
  { email, role }: MutationInviteUserArgs,
  { authedUser, UserService, AuthorizationService }: Context
): Promise<InviteUserResonse> {
  AuthorizationService.assertIsAdmin(authedUser);

  const result = await UserService.inviteUser(email, role);
  return { inviteSent: result.success };
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
