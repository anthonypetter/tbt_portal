import {
  MutationAddCohortArgs,
  MutationDeleteCohortArgs,
  MutationEditCohortArgs,
  QueryCohortArgs,
  QueryCohortsForOrgArgs,
} from "@generated/graphql";
import { gql } from "apollo-server";
import merge from "lodash/merge";
import { parse } from "querystring";
import { Context } from "../../context";
import { prisma } from "../../lib/prisma-client";
import { WhereByService } from "../../services/whereby";
import {
  calcStaffChanges,
  fromNewToInput,
} from "../../utils/cohortStaffAssignments";
import { parseId } from "../../utils/numbers";
import { fromJust } from "../../utils/types";
import { CohortResolver } from "./CohortResolver";
import {
  resolvers as CohortCsvResolvers,
  typeDefs as CohortCsvDefs,
} from "./csv";
import {
  resolvers as TeacherResolvers,
  typeDefs as TeacherDefs,
} from "./teacher";

/**
 * Type Defs
 */

export const typeDefs = gql`
  ${CohortCsvDefs}
  ${TeacherDefs}

  enum AssignmentSubject {
    MATH
    ELA
    GENERAL
  }

  type CohortStaffAssignment {
    user: User!
    subject: AssignmentSubject!
  }

  type CohortEvent {
    startFloatingDateTime: Date!
    durationMinutes: Int!
    timeZone: String!
    subject: AssignmentSubject!
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
    engagement: Engagement!
    staffAssignments: [CohortStaffAssignment!]!
    events: [CohortEvent!]!
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
    cohortsForOrg(organizationId: ID!): [Cohort!]!
    cohorts: [Cohort!]!
    cohort(id: ID!): Cohort!
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
  _args: undefined,
  { authedUser, AuthorizationService, CohortService }: Context
) {
  AuthorizationService.assertIsAdmin(authedUser);
  return CohortService.getAllCohorts();
}

async function cohort(
  _parent: undefined,
  { id }: QueryCohortArgs,
  { authedUser, AuthorizationService, CohortService }: Context
) {
  AuthorizationService.assertIsAdmin(authedUser);
  return CohortService.getCohort(parseId(id));
}

async function cohortsForOrg(
  _parent: undefined,
  { organizationId }: QueryCohortsForOrgArgs,
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

  const cohortCreated = await CohortService.addCohort(newCohort);

  // if the meeting room url was already provided, retrun the cohort
  if (cohortCreated.meetingRoom) {
    return cohortCreated;
  }

  const endDate = new Date(input.endDate);
  endDate.setDate(endDate.getDate() + 1);

  // else create meeting room on whereby,with cohort id prefexName
  const wherebyResult = await WhereByService.createWhereByRoom(
    endDate.toUTCString(),
    cohortCreated.engagementId,
    cohortCreated.id
  );

  const { roomUrl: meetingRoom, meetingId, hostRoomUrl } = wherebyResult;
  const hostRoomSearch = hostRoomUrl.split("?");
  const hostKey =
    hostRoomSearch.length > 1 ? parse(`${hostRoomSearch[1]}`).roomKey : "";

  return prisma.cohort.update({
    where: { id: cohortCreated.id },
    data: { meetingRoom, meetingId, hostKey: `${hostKey}` },
  });
}

/**
 * Resolvers
 */

export const resolvers = merge(
  {
    Query: {
      cohorts,
      cohort,
      cohortsForOrg,
    },
    Mutation: {
      editCohort,
      deleteCohort,
      addCohort,
    },
    Cohort: CohortResolver,
  },
  CohortCsvResolvers,
  TeacherResolvers
);
