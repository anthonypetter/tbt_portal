import { gql } from "apollo-server";

import { typeDefs as UserDefs, resolvers as UserResolvers } from "./users";
import merge from "lodash/merge";

export const typeDefs = gql`
  ${UserDefs}

  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
`;

export const resolvers = merge({}, UserResolvers);

console.log(resolvers);
