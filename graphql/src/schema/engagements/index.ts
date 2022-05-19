import { gql } from "apollo-server";
import { EngagementResolver } from "./EngagementResolver";
import { Context } from "../../context";
import { MutationEditEngagementArgs } from "../__generated__/graphql";
import { parseId } from "../../utils/numbers";
import { fromJust } from "../../utils/types";
import { calcStaffChanges } from "../../utils/staffAssignments";

/**
 * Type Defs
 */

export const typeDefs = gql`
  enum AssignmentRole {
    MENTOR_TEACHER
    SUBSTITUTE_TEACHER
    GENERAL_TEACHER
  }

  type StaffAssignment {
    user: User!
    assignmentRole: AssignmentRole!
  }

  type Engagement {
    id: ID!
    createdAt: Date!
    name: String!
    startDate: Date
    endDate: Date
    organizationId: ID!
    cohorts: [Cohort!]!
    staffAssignments: [StaffAssignment!]!
  }

  input NewStaffAssignment {
    userId: ID!
    assignmentRole: AssignmentRole!
  }

  input EditEngagementInput {
    id: ID!
    name: String
    startDate: Date
    endDate: Date
    newStaffAssignments: [NewStaffAssignment!]
  }

  extend type Mutation {
    editEngagement(input: EditEngagementInput!): Engagement!
  }
`;

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

  // Update engagement
  const updatedStaffAssignment = await EngagementService.editEngagement({
    id: engagementId,
    name: input.name,
    startDate: input.startDate,
    endDate: input.endDate,
    staffChangeSet,
  });

  return updatedStaffAssignment;
}

/**
 * Resolvers
 */

export const resolvers = {
  Mutation: {
    editEngagement,
  },
  Engagement: EngagementResolver,
};
