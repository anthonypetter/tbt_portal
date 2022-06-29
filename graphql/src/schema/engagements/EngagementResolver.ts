import { ResolversParentTypes } from "@generated/graphql";
import { Context } from "../../context";

export const EngagementResolver = {
  async cohorts(
    parent: ResolversParentTypes["Engagement"],
    _args: undefined,
    { CohortService }: Context
  ) {
    return CohortService.getCohortsForEngagement(parent.id);
  },

  async staffAssignments(
    parent: ResolversParentTypes["Engagement"],
    _args: undefined,
    { EngagementService }: Context
  ) {
    const staffAssignments =
      parent.staffAssignments?.length > 0
        ? parent.staffAssignments
        : await EngagementService.getStaffAssignments(parent.id);

    return staffAssignments.map((sa) => ({
      user: sa.user,
      role: sa.role,
    }));
  },

  async organization(
    parent: ResolversParentTypes["Engagement"],
    _args: undefined,
    { OrganizationService }: Context
  ) {
    if (parent.organization) {
      return parent.organization;
    }

    return OrganizationService.getOrganization(parent.organizationId);
  },
};
