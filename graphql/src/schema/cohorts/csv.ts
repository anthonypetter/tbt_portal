import { MutationSaveCohortsCsvDataArgs } from "@generated/graphql";
import { gql } from "apollo-server";
import { Context } from "../../context";
import { parseId } from "../../utils/numbers";

/**
 * Type Defs
 */

export const typeDefs = gql`
  input Time {
    hour: Int!
    minute: Int!
  }

  input CsvSubjectSchedule {
    subject: AssignmentSubject!
    startTime: Time!
    endTime: Time!
    timeZone: String!
  }

  input CsvCohortTeacher {
    fullName: String!
    email: String!
  }

  input CsvCohortStaffAssignment {
    subject: AssignmentSubject!
    teacher: CsvCohortTeacher!
  }

  input CsvProcessedCohort {
    cohortName: String!
    grade: String!
    googleClassroomLink: String

    monday: [CsvSubjectSchedule!]!
    tuesday: [CsvSubjectSchedule!]!
    wednesday: [CsvSubjectSchedule!]!
    thursday: [CsvSubjectSchedule!]!
    friday: [CsvSubjectSchedule!]!
    saturday: [CsvSubjectSchedule!]!
    sunday: [CsvSubjectSchedule!]!
    cohortStartDate: Date!
    cohortEndDate: Date!

    staffAssignments: [CsvCohortStaffAssignment!]!
  }

  input CsvProcessedData {
    engagementId: ID!
    cohorts: [CsvProcessedCohort!]!
  }

  type CsvSaveCountsResult {
    newTeacherCount: Int!
    newCohortCount: Int!
  }

  extend type Mutation {
    saveCohortsCsvData(input: CsvProcessedData!): CsvSaveCountsResult!
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
