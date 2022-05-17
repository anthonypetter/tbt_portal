import { gql } from "apollo-server";
import { Context } from "../../context";
import { QuerySearchUsersArgs } from "../__generated__/graphql";

/**
 * Type Defs
 */

export const typeDefs = gql`
  type SearchResults {
    count: Int!
    results: [User!]!
  }

  extend type Query {
    searchUsers(query: String!): SearchResults!
  }
`;

/**
 * Query Resolvers
 */

async function searchUsers(
  _parent: undefined,
  { query }: QuerySearchUsersArgs,
  { authedUser, AuthorizationService, SearchService }: Context
) {
  AuthorizationService.assertIsAdmin(authedUser);

  const results = await SearchService.searchUsers(query);

  return {
    count: results.length,
    results: results,
  };
}

/**
 * Mutation Resolvers
 */

export const resolvers = {
  Query: {
    searchUsers,
  },
};
