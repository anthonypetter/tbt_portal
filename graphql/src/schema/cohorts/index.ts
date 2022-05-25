import { gql } from "apollo-server";
import { Context } from "../../context";
import {
  QueryCohortsArgs,
  MutationEditCohortArgs,
  MutationDeleteCohortArgs,
  MutationAddCohortArgs,
} from "../__generated__/graphql";
import { parseId } from "../../utils/numbers";
import { CohortResolver } from "./CohortResolver";
import { fromJust } from "../../utils/types";
import { calcStaffChanges, fromNewToInput } from "../../utils/staffAssignments";

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

  input AddCohortInput {
    engagementId: ID!
    name: String!
    startDate: Date
    endDate: Date
    grade: String
    hostKey: String
    meetingRoom: String
    newStaffAssignments: [NewStaffAssignment!]!
  }

  extend type Query {
    cohorts(organizationId: ID!): [Cohort!]!
  }

  extend type Mutation {
    editCohort(input: EditCohortInput!): Cohort!
    addCohort(input: AddCohortInput!): Cohort!
    deleteCohort(id: ID!): Cohort!
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

async function deleteCohort(
  _parent: undefined,
  { id }: MutationDeleteCohortArgs,
  { authedUser, AuthorizationService, CohortService }: Context
) {
  AuthorizationService.assertIsAdmin(authedUser);
  return CohortService.deleteCohort(parseId(id));
}

async function addCohort(
  _parent: undefined,
  { input }: MutationAddCohortArgs,
  { authedUser, AuthorizationService, CohortService }: Context
) {
  AuthorizationService.assertIsAdmin(authedUser);

  return CohortService.addCohort({
    name: input.name,
    engagementId: parseId(input.engagementId),
    startDate: input.startDate,
    endDate: input.endDate,
    grade: input.grade,
    hostKey: input.hostKey,
    meetingRoom: input.meetingRoom,
    staff: input.newStaffAssignments.map((t) => fromNewToInput(t)),
  });
}

/**
 * Resolvers
 */

export const resolvers = {
  Query: {
    cohorts,
  },
  Mutation: {
    editCohort,
    deleteCohort,
    addCohort,
  },
  Cohort: CohortResolver,
};
