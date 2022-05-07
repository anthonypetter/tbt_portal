import { User } from "@prisma/client";
import { UserService } from "./services/user";
import { AuthorizationService } from "./services/authorization";
import { ExpressContext } from "apollo-server-express";
import { getUser } from "./lib/cognito";
import { AuthenticationError } from "apollo-server";
import { OrganizationService } from "./services/organization";

export type Context = {
  authedUser: User;
  UserService: typeof UserService;
  AuthorizationService: typeof AuthorizationService;
  OrganizationService: typeof OrganizationService;
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
    authedUser,
    UserService,
    AuthorizationService,
    OrganizationService,
  };
}
