import { Resolvers } from "@generated/graphql";
import { gql } from "apollo-server";
import merge from "lodash/merge";
import {
  resolvers as CohortResolvers,
  typeDefs as CohortDefs,
} from "./cohorts";
import {
  resolvers as EngagementResolvers,
  typeDefs as EngagementDefs,
} from "./engagements";
import {
  resolvers as OrganizationResolvers,
  typeDefs as OrganizationDefs,
} from "./organizations";
import { dateScalar } from "./scalars/date";
import { resolvers as SearchResolvers, typeDefs as SearchDefs } from "./search";
import { resolvers as UserResolvers, typeDefs as UserDefs } from "./users";

export const typeDefs = gql`
  scalar Date

  ${UserDefs}
  ${OrganizationDefs}
  ${EngagementDefs}
  ${CohortDefs}
  ${SearchDefs}

  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
`;

export const resolvers: Resolvers = merge(
  { Date: dateScalar },
  UserResolvers,
  OrganizationResolvers,
  EngagementResolvers,
  CohortResolvers,
  SearchResolvers
);
