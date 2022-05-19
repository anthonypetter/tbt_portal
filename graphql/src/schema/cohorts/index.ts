import { gql } from "apollo-server";
import { Context } from "../../context";
import {
  QueryCohortsArgs,
  MutationEditCohortArgs,
} from "../__generated__/graphql";
import { parseId } from "../../utils/numbers";
import { CohortResolver } from "./CohortResolver";
import { fromJust } from "../../utils/types";
import { calcStaffChanges } from "../../utils/staffAssignments";

/**
 * Type Defs
 */

export const typeDefs = gql`
  type Cohort {
    id: ID!
    createdAt: Date!
    name: String!
    grade: String
    meetingRoom: String
    hostKey: String
    exempt: String
    startDate: Date
    endDate: Date

    engagementId: ID!
    staffAssignments: [StaffAssignment!]!
  }

  input EditCohortInput {
    id: ID!
    name: String
    startDate: Date
    endDate: Date
    grade: String
    hostKey: String
    meetingRoom: String
    newStaffAssignments: [NewStaffAssignment!]
  }

  extend type Query {
    cohorts(organizationId: ID!): [Cohort!]!
  }

  extend type Mutation {
    editCohort(input: EditCohortInput!): Cohort!
  }
`;

/**
 * Query Resolvers
 */

async function cohorts(
  _parent: undefined,
  { organizationId }: QueryCohortsArgs,
  { authedUser, AuthorizationService, CohortService }: Context
) {
  AuthorizationService.assertIsAdmin(authedUser);
  return CohortService.getCohortsForOrg(parseId(organizationId));
}

/**
 * Mutation resolvers
 */

async function editCohort(
  _parent: undefined,
  { input }: MutationEditCohortArgs,
  { authedUser, AuthorizationService, CohortService }: Context
) {
  AuthorizationService.assertIsAdmin(authedUser);

  if (input.name === null) {
    throw new Error("Cohort name cannot be null.");
  }

  const cohortId = parseId(input.id);

  let staffChangeSet;
  if (input.newStaffAssignments) {
    const existingCohort = fromJust(
      await CohortService.getCohort(cohortId),
      "existingCohort"
    );

    staffChangeSet = calcStaffChanges(
      existingCohort.staffAssignments,
      input.newStaffAssignments
    );
  }

  const updatedStaffAssignment = await CohortService.editCohort({
    id: cohortId,
    name: input.name,
    startDate: input.startDate,
    endDate: input.endDate,
    grade: input.grade,
    hostKey: input.hostKey,
    meetingRoom: input.meetingRoom,
    staffChangeSet,
  });

  return updatedStaffAssignment;
}

export const resolvers = {
  Query: {
    cohorts,
  },
  Mutation: {
    editCohort,
  },
  Cohort: CohortResolver,
};
