import { parseId } from "../../utils/numbers";
import { Context } from "../../context";
import { Engagement } from "../__generated__/graphql";

export const EngagementResolver = {
  async cohorts(
    parent: Engagement,
    _args: undefined,
    { authedUser, AuthorizationService, CohortService }: Context
  ) {
    AuthorizationService.assertIsAdmin(authedUser);
    return CohortService.getCohorts(parseId(parent.id));
  },
};
