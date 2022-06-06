import { gql } from "apollo-server";
import { Context } from "../../context";
import {
  QueryCohortsArgs,
  MutationEditCohortArgs,
  MutationDeleteCohortArgs,
  MutationAddCohortArgs,
  QueryCohortMockScheduleArgs,
} from "../__generated__/graphql";
import { parseId } from "../../utils/numbers";
import { CohortResolver } from "./CohortResolver";
import { fromJust } from "../../utils/types";
import {
  calcStaffChanges,
  fromNewToInput,
} from "../../utils/cohortStaffAssignments";

/**
 * Type Defs
 */

export const typeDefs = gql`
  enum AssignmentSubject {
    MATH
    ELA
    GENERAL
  }

  type CohortStaffAssignment {
    user: User!
    subject: AssignmentSubject!
  }

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
    staffAssignments: [CohortStaffAssignment!]!
  }

  ########## FOR MOCKING PURPOSES ONLY ##########
  type SubjectSchedule {
    subject: AssignmentSubject!
    startTime: String!
    endTime: String!
    timezone: String!
  }
  type WeeklySchedule {
    monday: [SubjectSchedule!]!
    tuesday: [SubjectSchedule!]!
    wednesday: [SubjectSchedule!]!
    thursday: [SubjectSchedule!]!
    friday: [SubjectSchedule!]!
    saturday: [SubjectSchedule!]!
    sunday: [SubjectSchedule!]!
  }
  type CohortMockSchedule {
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
    staffAssignments: [CohortStaffAssignment!]!

    weeklySchedule: WeeklySchedule! # ONLY ADDED BIT
  }
  ########## FOR MOCKING PURPOSES ONLY ##########

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
    newStaffAssignments: [NewCohortStaffAssignment!]!
  }

  extend type Query {
    cohorts(organizationId: ID!): [Cohort!]!
    cohortMockSchedule(cohortId: ID!): CohortMockSchedule
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

//////////// FOR MOCKING PURPOSES ONLY ////////////
async function cohortMockSchedule(
  _parent: undefined,
  { cohortId }: QueryCohortMockScheduleArgs,
  { authedUser, AuthorizationService, CohortService }: Context
) {
  AuthorizationService.assertIsAdmin(authedUser);
  const cohort = await CohortService.getCohort(parseId(cohortId));
  if (cohort == null) {
    return null;
  }

  return {
    ...cohort,
    __typename: "CohortMockSchedule",
    weeklySchedule: {
      monday: [
        {
          subject: "MATH",
          startTime: "11:30",
          endTime: "12:30",
          timezone: "EST",
        },
        {
          subject: "ELA",
          startTime: "12:30",
          endTime: "13:30",
          timezone: "EST",
        },
      ],
      tuesday: [
        {
          subject: "MATH",
          startTime: "11:30",
          endTime: "12:30",
          timezone: "EST",
        },
        {
          subject: "ELA",
          startTime: "12:30",
          endTime: "13:30",
          timezone: "EST",
        },
      ],
      wednesday: [
        {
          subject: "MATH",
          startTime: "11:30",
          endTime: "12:30",
          timezone: "EST",
        },
        {
          subject: "ELA",
          startTime: "12:30",
          endTime: "13:30",
          timezone: "EST",
        },
      ],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    },
  };
}
//////////// FOR MOCKING PURPOSES ONLY ////////////

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
    cohortMockSchedule, //////////// FOR MOCKING PURPOSES ONLY ////////////
  },
  Mutation: {
    editCohort,
    deleteCohort,
    addCohort,
  },
  Cohort: CohortResolver,
};
