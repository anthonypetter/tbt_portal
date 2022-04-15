import { gql } from "apollo-server";
import {
  typeDefs as HellWorldDefs,
  resolvers as HelloWorldResolvers,
} from "./domain/hello-world/HelloWorld";
import merge from "lodash/merge";

export const typeDefs = gql`
  ${HellWorldDefs}

  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
`;

export const resolvers = merge({}, HelloWorldResolvers);
