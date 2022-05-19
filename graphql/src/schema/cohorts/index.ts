import { gql } from "apollo-server";
import { Context } from "../../context";
import { QueryCohortsArgs } from "../__generated__/graphql";
import { parseId } from "../../utils/numbers";
import { CohortResolver } from "./CohortResolver";

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

  extend type Query {
    cohorts(organizationId: ID!): [Cohort!]!
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

export const resolvers = {
  Query: {
    cohorts,
  },
  Cohort: CohortResolver,
};
