import { gql } from "apollo-server";
import { Context } from "../../context";
import { MutationInviteUserArgs } from "../__generated__/graphql";
import { UserResolvers } from "./UserResolvers";

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

  type StaffEngagementAssignment {
    engagement: Engagement!
    role: AssignmentRole
  }

  type StaffCohortAssignment {
    cohort: Cohort!
    subject: AssignmentSubject!
  }

  type User {
    id: String!
    email: String!
    fullName: String!
    role: UserRole!
    accountStatus: AccountStatus!
    engagementAssignments: [StaffEngagementAssignment]
    cohortAssignments: [StaffCohortAssignment]
  }

  input InviteUserInput {
    email: String!
    fullName: String!
    role: UserRole!
  }

  extend type Query {
    currentUser: User
    users: [User!]!
    teachers: [User!]!
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

async function teachers(
  _parent: undefined,
  _args: undefined,
  { authedUser, UserService, AuthorizationService }: Context
) {
  AuthorizationService.assertIsAdmin(authedUser);
  return UserService.getTeachers();
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
    teachers,
  },
  Mutation: {
    inviteUser,
  },
  User: UserResolvers
};
