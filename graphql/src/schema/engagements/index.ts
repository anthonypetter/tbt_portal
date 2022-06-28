import {
  MutationAddEngagementArgs,
  MutationDeleteEngagementArgs,
  MutationEditEngagementArgs,
  QueryEngagementArgs,
} from "@generated/graphql";
import { gql } from "apollo-server";
import { Context } from "../../context";
import {
  calcStaffChanges,
  fromNewToInput,
} from "../../utils/engagementStaffAssignments";
import { parseId } from "../../utils/numbers";
import { fromJust } from "../../utils/types";
import { EngagementResolver } from "./EngagementResolver";

/**
 * Type Defs
 */

export const typeDefs = gql`
  enum AssignmentRole {
    MENTOR_TEACHER
    SUBSTITUTE_TEACHER
    GENERAL_TEACHER
  }

  type EngagementStaffAssignment {
    user: User!
    role: AssignmentRole!
  }

  type Engagement {
    id: ID!
    createdAt: Date!
    name: String!
    startDate: Date
    endDate: Date
    organizationId: ID!
    cohorts: [Cohort!]!
    staffAssignments: [EngagementStaffAssignment!]!
    organization: Organization!
  }

  input NewEngagementStaffAssignment {
    userId: ID!
    role: AssignmentRole!
  }

  input EditEngagementInput {
    id: ID!
    name: String
    startDate: Date
    endDate: Date
    newStaffAssignments: [NewEngagementStaffAssignment!]
  }

  input AddEngagementInput {
    organizationId: ID!
    name: String!
    startDate: Date
    endDate: Date
    newStaffAssignments: [NewEngagementStaffAssignment!]!
  }

  extend type Query {
    engagements: [Engagement!]!
    engagement(id: ID!): Engagement
  }

  extend type Mutation {
    editEngagement(input: EditEngagementInput!): Engagement!
    addEngagement(input: AddEngagementInput!): Engagement!
    deleteEngagement(id: ID!): Engagement!
  }
`;

/**
 * Query resolvers
 */

async function engagement(
  _parent: undefined,
  { id }: QueryEngagementArgs,
  { authedUser, AuthorizationService, EngagementService }: Context
) {
  AuthorizationService.assertIsAdmin(authedUser);
  return EngagementService.getEngagement(parseId(id));
  //
}

async function engagements(
  _parent: undefined,
  _args: undefined,
  { authedUser, AuthorizationService, EngagementService }: Context
) {
  AuthorizationService.assertIsAdmin(authedUser);
  return EngagementService.getAllEngagements();
}

/**
 * Mutation resolvers
 */

async function editEngagement(
  _parent: undefined,
  { input }: MutationEditEngagementArgs,
  { authedUser, AuthorizationService, EngagementService }: Context
) {
  AuthorizationService.assertIsAdmin(authedUser);

  if (input.name === null) {
    throw new Error("Engagement name cannot be null.");
  }

  const engagementId = parseId(input.id);

  let staffChangeSet;
  if (input.newStaffAssignments) {
    const existingEngagement = fromJust(
      await EngagementService.getEngagement(engagementId),
      "existingEngagement"
    );

    staffChangeSet = calcStaffChanges(
      existingEngagement.staffAssignments,
      input.newStaffAssignments
    );
  }

  const updatedStaffAssignment = await EngagementService.editEngagement({
    id: engagementId,
    name: input.name,
    startDate: input.startDate,
    endDate: input.endDate,
    staffChangeSet,
  });

  return updatedStaffAssignment;
}

async function addEngagement(
  _parent: undefined,
  { input }: MutationAddEngagementArgs,
  { authedUser, AuthorizationService, EngagementService }: Context
) {
  AuthorizationService.assertIsAdmin(authedUser);

  return EngagementService.addEngagement({
    name: input.name,
    organizationId: parseId(input.organizationId),
    startDate: input.startDate,
    endDate: input.endDate,
    staff: input.newStaffAssignments.map((t) => fromNewToInput(t)),
  });
}

async function deleteEngagement(
  _parent: undefined,
  { id }: MutationDeleteEngagementArgs,
  { authedUser, AuthorizationService, EngagementService }: Context
) {
  AuthorizationService.assertIsAdmin(authedUser);
  return EngagementService.deleteEngagement(parseId(id));
}

/**
 * Resolvers
 */

export const resolvers = {
  Query: {
    engagement,
    engagements,
  },
  Mutation: {
    editEngagement,
    addEngagement,
    deleteEngagement,
  },
  Engagement: EngagementResolver,
};
