import { gql } from "apollo-server";
import { EngagementResolver } from "./EngagementResolver";
import { Context } from "../../context";
import { MutationEditEngagementArgs } from "../__generated__/graphql";
import { parseId } from "../../utils/numbers";

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

  input StaffAssignmentEdit {
    userId: ID!
    assignmentRole: AssignmentRole!
  }

  input EditEngagementInput {
    id: ID!
    name: String
    startDate: Date
    endDate: Date
    staffAssignments: [StaffAssignmentEdit!]
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
  // We allow name to come in undefined (represents when the user is not trying to update the name field)
  // But if name *does* come in, we don't allow it to be null.
  // Not quite sure how to represent this in graphql schema yet.
  if (input.name == null) {
    throw new Error("Engagement name cannot be null.");
  }

  console.log("----------------------------");

  console.log("input", input);

  return EngagementService.editEngagement({
    id: parseId(input.id),
    name: input.name,
    startDate: input.startDate,
    endDate: input.endDate,
  });
}

export const resolvers = {
  Mutation: {
    editEngagement,
  },
  Engagement: EngagementResolver,
};
