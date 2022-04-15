import { gql } from "apollo-server";
import { Context } from "../../context";

/**
 * Type Defs
 */

export const typeDefs = gql`
  type Query {
    hello: String!
  }
`;

/**
 * Query Resolvers
 */

async function hello(
  _parent: undefined,
  _args: undefined,
  { prisma }: Context
) {
  const user = await prisma.user.findUnique({
    where: {
      email: "victor@tutored.live",
    },
  });

  console.log(user);

  return "world!";
}

export const resolvers = {
  Query: {
    hello,
  },
};
