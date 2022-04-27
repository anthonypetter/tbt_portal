import { gql } from "apollo-server";
import { Context } from "../../context";

/**
 * Type Defs
 */

export const typeDefs = gql`
  type User {
    email: String!
  }

  type Query {
    currentUser: User
  }
`;

/**
 * Query Resolvers
 */

async function currentUser(
  _parent: undefined,
  _args: undefined,
  { authedUser }: Context
) {
  return authedUser;
}

export const resolvers = {
  Query: {
    currentUser,
  },
};
