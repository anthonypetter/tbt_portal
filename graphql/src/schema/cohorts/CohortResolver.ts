import { ResolversParentTypes } from "@generated/graphql";
import { Context } from "../../context";

export const CohortResolver = {
  async staffAssignments(
    parent: ResolversParentTypes["Cohort"],
    _args: undefined,
    { CohortService }: Context
  ) {
    const staffAssignments =
      parent.staffAssignments?.length > 0
        ? parent.staffAssignments
        : await CohortService.getStaffAssignments(parent.id);

    return staffAssignments.map((sa) => ({
      user: sa.user,
      subject: sa.subject,
    }));
  },

  async engagement(
    parent: ResolversParentTypes["Cohort"],
    _args: undefined,
    { EngagementService }: Context
  ) {
    return EngagementService.getEngagement(parent.engagementId);
  },

  async events(
    parent: ResolversParentTypes["Cohort"],
    _args: undefined,
    { CohortService }: Context
  ) {
    return CohortService.getCohortEventsForCurrentWeek(parent.id);
  },
};
