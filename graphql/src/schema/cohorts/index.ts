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
import {
  calcStaffChanges,
  fromNewToInput,
} from "../../utils/cohortStaffAssignments";
import {
  typeDefs as CohortCsvDefs,
  resolvers as CohortCsvResolvers,
} from "./csv";
import merge from "lodash/merge";
import { WhereByService } from "../../services/whereby";

/**
 * Type Defs
 */

export const typeDefs = gql`
  ${CohortCsvDefs}

  enum AssignmentSubject {
    MATH
    ELA
    GENERAL
  }

  enum Weekday {
    SUNDAY
    MONDAY
    TUESDAY
    WEDNESDAY
    THURSDAY
    FRIDAY
    SATURDAY
  }

  type CohortStaffAssignment {
    user: User!
    subject: AssignmentSubject!
  }

  type ScheduledMeeting {
    createdAt: Date!
    weekday: Weekday!
    subject: AssignmentSubject!
    startTime: String!
    endTime: String!
    timeZone: String!
  }

  type Cohort {
    id: ID!
    createdAt: Date!
    name: String!
    grade: String
    meetingRoom: String
    hostKey: String
    meetingId: String
    exempt: String
    startDate: Date
    endDate: Date

    engagementId: ID!
    staffAssignments: [CohortStaffAssignment!]!
    schedule: [ScheduledMeeting!]!
  }

  input NewCohortStaffAssignment {
    userId: ID!
    subject: AssignmentSubject!
  }

  input EditCohortInput {
    id: ID!
    name: String
    startDate: Date
    endDate: Date
    grade: String
    hostKey: String
    meetingRoom: String
    newStaffAssignments: [NewCohortStaffAssignment!]
  }

  input AddCohortInput {
    engagementId: ID!
    name: String!
    startDate: Date
    endDate: Date
    grade: String
    hostKey: String
    meetingRoom: String
    meetingId: String
    newStaffAssignments: [NewCohortStaffAssignment!]!
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
  const cohortDeleted = await CohortService.deleteCohort(parseId(id));
  if (cohortDeleted?.meetingId) {
    await WhereByService.deleteWhereByRoom(cohortDeleted.meetingId);
  }
  return cohortDeleted;
}

async function addCohort(
  _parent: undefined,
  { input }: MutationAddCohortArgs,
  { authedUser, AuthorizationService, CohortService }: Context
) {
  AuthorizationService.assertIsAdmin(authedUser);
  const newCohort = {
    name: input.name,
    engagementId: parseId(input.engagementId),
    startDate: input.startDate,
    endDate: input.endDate,
    grade: input.grade,
    hostKey: input.hostKey,
    meetingId: input.meetingId,
    meetingRoom: input.meetingRoom,
    staff: input.newStaffAssignments.map((t) => fromNewToInput(t)),
  };

  // if meeting room url is specified, just create the cohort
  if (newCohort.meetingRoom) {
    return CohortService.addCohort(newCohort);
  }

  // else create meeting room on whereby and create the cohort
  const wherebyResult = await WhereByService.createWhereByRoom(
    new Date(input.startDate).toISOString(),
    new Date(input.endDate).toISOString()
  );

  newCohort.meetingRoom = wherebyResult?.hostRoomUrl;
  newCohort.meetingId = wherebyResult?.meetingId;

  return CohortService.addCohort(newCohort);
}

/**
 * Resolvers
 */

export const resolvers = merge(
  {
    Query: {
      cohorts,
    },
    Mutation: {
      editCohort,
      deleteCohort,
      addCohort,
    },
    Cohort: CohortResolver,
  },
  CohortCsvResolvers
);
