import { ApolloServer, gql } from "apollo-server";
import { PrismaClient } from "@prisma/client";
import { context } from "./context";
import { resolvers, typeDefs } from "./schema";

const server = new ApolloServer({ typeDefs, resolvers, context });

server.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at: http://localhost:4000`)
);
