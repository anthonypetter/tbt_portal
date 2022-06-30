import {
  QuerySearchEngagementsArgs,
  QuerySearchOrganizationsArgs,
  QuerySearchUsersArgs
} from "@generated/graphql";
import { gql } from "apollo-server";
import { Context } from "../../context";

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

  type OrganizationsSearchResults {
    count: Int!
    results: [Organization!]!
  }

  extend type Query {
    searchUsers(query: String!): UsersSearchResults!
    searchEngagements(query: String!): EngagementsSearchResults!
    searchOrganizations(query: String!): OrganizationsSearchResults!
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
    results,
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
    results,
  };
}


async function searchOrganizations(
  _parent: undefined,
  { query }: QuerySearchOrganizationsArgs,
  { authedUser, AuthorizationService, SearchService }: Context
) {
  AuthorizationService.assertIsAdmin(authedUser);
  const results = await SearchService.searchOrganizations(query);

  return {
    count: results.length,
    results,
  };
}

/**
 * Mutation Resolvers
 */

export const resolvers = {
  Query: {
    searchUsers,
    searchEngagements,
    searchOrganizations,
  },
};
