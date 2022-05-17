import { User } from "@prisma/client";
import { UserService } from "./services/user";
import { AuthorizationService } from "./services/authorization";
import { ExpressContext } from "apollo-server-express";
import { authenticateUser } from "./lib/cognito";
import { AuthenticationError } from "apollo-server";
import { OrganizationService } from "./services/organization";
import { EngagementService } from "./services/engagement";
import { CohortService } from "./services/cohort";
import { SearchService } from "./services/search";

export type Context = {
  authedUser: User;
  UserService: typeof UserService;
  AuthorizationService: typeof AuthorizationService;
  OrganizationService: typeof OrganizationService;
  EngagementService: typeof EngagementService;
  CohortService: typeof CohortService;
  SearchService: typeof SearchService;
};

export async function getContext({ req }: ExpressContext): Promise<Context> {
  const authHeader = req.headers.authorization;
  const authedUser = await authenticateUser(authHeader);

  if (!authedUser) {
    throw new AuthenticationError("User not found.");
  }

  if (UserService.accountIsPending(authedUser)) {
    await UserService.activateUser(authedUser);
    console.log(`[Auth]: '${authedUser.email}' account activated.`);
  }

  console.log(`[Auth]: '${authedUser.email}' authenticated.`);

  /**
   * Intentionally leaving prisma off context.
   * Idea is that all db access should go through a "service" layer.
   */

  return {
    authedUser,
    UserService,
    AuthorizationService,
    OrganizationService,
    EngagementService,
    CohortService,
    SearchService,
  };
}
