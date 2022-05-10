import { gql } from "apollo-server";
import { EngagementResolver } from "./EngagementResolver";

/**
 * Type Defs
 */

export const typeDefs = gql`
  type Engagement {
    id: ID!
    # createdAt: Date
    name: String
    cohorts: [Cohort!]!
    # startDate: Date
    # endDate: Date
  }
`;

export const resolvers = {
  Engagement: EngagementResolver,
};
