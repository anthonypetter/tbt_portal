import { Organization } from "@generated/graphql";
import { Context } from "../../context";
import { parseId } from "../../utils/numbers";

export const OrganizationResolver = {
  async engagements(
    parent: Organization,
    _args: undefined,
    { authedUser, AuthorizationService, EngagementService }: Context
  ) {
    AuthorizationService.assertIsAdmin(authedUser);
    return EngagementService.getEngagements(parseId(parent.id));
  },
};
