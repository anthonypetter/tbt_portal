import { Context } from "../../context";
import { Engagement } from "../__generated__/graphql";
import { parseId } from "../../utils/numbers";

export const EngagementResolver = {
  async cohorts(
    parent: Engagement,
    _args: undefined,
    { authedUser, AuthorizationService, CohortService }: Context
  ) {
    AuthorizationService.assertIsAdmin(authedUser);
    return CohortService.getCohortsForEngagement(parseId(parent.id));
  },

  async staffAssignments(
    parent: Engagement,
    _args: undefined,
    { authedUser, AuthorizationService }: Context
  ) {
    AuthorizationService.assertIsAdmin(authedUser);

    return parent.staffAssignments.map((sa) => ({
      user: sa.user,
      role: sa.role,
    }));
  },

  async organization(
    parent: Engagement,
    _args: undefined,
    { authedUser, AuthorizationService, OrganizationService }: Context
  ) {
    AuthorizationService.assertIsAdmin(authedUser);

    if (parent.organization) {
      return parent.organization;
    }

    return OrganizationService.getOrganization(parseId(parent.organizationId));
  },
};
