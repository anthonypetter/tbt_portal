import { parseId } from "../../utils/numbers";
import { gql } from "apollo-server";
import { Context } from "../../context";
import { MutationSaveCohortsCsvDataArgs } from "../__generated__/graphql";

/**
 * Type Defs
 */

export const typeDefs = gql`
  input SubjectSchedule {
    subject: AssignmentSubject!
    startTime: String!
    endTime: String!
    timeZone: String!
  }

  input CohortCsvTeacher {
    fullName: String!
    email: String!
  }

  input CohortCsvStaffAssignment {
    subject: AssignmentSubject!
    teacher: CohortCsvTeacher!
  }

  input ProcessedCohort {
    cohortName: String!
    grade: String!
    googleClassroomLink: String

    monday: [SubjectSchedule!]!
    tuesday: [SubjectSchedule!]!
    wednesday: [SubjectSchedule!]!
    thursday: [SubjectSchedule!]!
    friday: [SubjectSchedule!]!
    saturday: [SubjectSchedule!]!
    sunday: [SubjectSchedule!]!

    staffAssignments: [CohortCsvStaffAssignment!]!
  }

  input ProcessedCsv {
    engagementId: ID!
    cohorts: [ProcessedCohort!]!
  }

  type SaveCountsResult {
    newTeacherCount: Int!
    newCohortCount: Int!
  }

  extend type Mutation {
    saveCohortsCsvData(input: ProcessedCsv!): SaveCountsResult!
  }
`;

/**
 * Mutation resolvers
 */

async function saveCohortsCsvData(
  _parent: undefined,
  { input }: MutationSaveCohortsCsvDataArgs,
  { authedUser, AuthorizationService, CohortService }: Context
) {
  AuthorizationService.assertIsAdmin(authedUser);
  return CohortService.saveCsvCohortsData(
    parseId(input.engagementId),
    input.cohorts
  );
}

/**
 * Resolvers
 */

export const resolvers = {
  Mutation: {
    saveCohortsCsvData,
  },
};
