import { User } from "@prisma/client";
import { UserService } from "@services/user";
import { ExpressContext } from "apollo-server-express";
import { getUser } from "@lib/cognito";
import { AuthenticationError } from "apollo-server";

export type Context = {
  authedUser: User;
  UserService: typeof UserService;
};

export async function getContext({ req }: ExpressContext): Promise<Context> {
  const authHeader = req.headers.authorization;
  const authedUser = await getUser(authHeader);

  if (!authedUser) {
    throw new AuthenticationError("User not found.");
  }

  console.log(`[Auth]: '${authedUser.email}' authenticated.`);

  /**
   * Intentionally leaving prisma off context. (for now)
   * Idea is that all db access should go through a "service" layer.
   */

  return {
    // prisma
    authedUser,
    UserService,
  };
}
