import { parseId } from "../../utils/numbers";
import { Context } from "../../context";
import { Organization } from "../__generated__/graphql";

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
