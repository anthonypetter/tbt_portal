import { gql } from "apollo-server";

import { typeDefs as UserDefs, resolvers as UserResolvers } from "./users";
import {
  typeDefs as OrganizationDefs,
  resolvers as OrganizationResolvers,
} from "./organizations";

import merge from "lodash/merge";

export const typeDefs = gql`
  ${UserDefs}
  ${OrganizationDefs}

  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
`;

export const resolvers = merge({}, UserResolvers, OrganizationResolvers);
