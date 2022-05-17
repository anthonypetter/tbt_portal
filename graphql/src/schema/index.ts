import { gql } from "apollo-server";

import { typeDefs as UserDefs, resolvers as UserResolvers } from "./users";
import {
  typeDefs as OrganizationDefs,
  resolvers as OrganizationResolvers,
} from "./organizations";
import {
  typeDefs as EngagementDefs,
  resolvers as EngagementResolvers,
} from "./engagements";
import {
  typeDefs as CohortDefs,
  resolvers as CohortResolvers,
} from "./cohorts";
import { typeDefs as SearchDefs, resolvers as SearchResolvers } from "./search";
import { dateScalar } from "./scalars/date";

import merge from "lodash/merge";

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

export const resolvers = merge(
  { Date: dateScalar },
  UserResolvers,
  OrganizationResolvers,
  EngagementResolvers,
  CohortResolvers,
  SearchResolvers
);
