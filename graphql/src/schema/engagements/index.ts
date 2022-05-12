import { gql } from "apollo-server";
import { EngagementResolver } from "./EngagementResolver";

/**
 * Type Defs
 */

export const typeDefs = gql`
  type Engagement {
    id: ID!
    createdAt: Date!
    name: String!
    startDate: Date
    endDate: Date
    organizationId: ID!
    cohorts: [Cohort!]!
  }
`;

export const resolvers = {
  Engagement: EngagementResolver,
};
