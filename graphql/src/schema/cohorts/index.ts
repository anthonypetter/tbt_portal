import { gql } from "apollo-server";

/**
 * Type Defs
 */

export const typeDefs = gql`
  type Cohort {
    id: ID!
    name: String
    grade: String
  }
`;

export const resolvers = {};
