import { ApolloServer } from "apollo-server";
import { resolvers, typeDefs } from "./schema";
import { getContext } from "./context";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: getContext,
});

server.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at: http://localhost:4000!`)
);
