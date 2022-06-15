import { gql } from "apollo-server";
import { Context } from "../../context";
import {
  QuerySearchUsersArgs,
  QuerySearchEngagementsArgs,
} from "../__generated__/graphql";

/**
 * Type Defs
 */

export const typeDefs = gql`
  type UsersSearchResults {
    count: Int!
    results: [User!]!
  }

  type EngagementsSearchResults {
    count: Int!
    results: [Engagement!]!
  }

  extend type Query {
    searchUsers(query: String!): UsersSearchResults!
    searchEngagements(query: String!): EngagementsSearchResults!
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

async function searchEngagements(
  _parent: undefined,
  { query }: QuerySearchEngagementsArgs,
  { authedUser, AuthorizationService, SearchService }: Context
) {
  AuthorizationService.assertIsAdmin(authedUser);
  const results = await SearchService.searchEngagements(query);

  return {
    count: results.length,
    engagements: results,
  };
}

/**
 * Mutation Resolvers
 */

export const resolvers = {
  Query: {
    searchUsers,
    searchEngagements,
  },
};
