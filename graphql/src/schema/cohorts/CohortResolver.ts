import { Context } from "../../context";
import { ResolversParentTypes } from "../__generated__/graphql";

export const CohortResolver = {
  async staffAssignments(
    parent: ResolversParentTypes["Cohort"],
    _args: undefined,
    { authedUser, AuthorizationService, CohortService }: Context
  ) {
    AuthorizationService.assertIsAdmin(authedUser);

    const staffAssignments =
      parent.staffAssignments?.length > 0
        ? parent.staffAssignments
        : await CohortService.getStaffAssignments(parent.id);

    return staffAssignments.map((sa) => ({
      user: sa.user,
      subject: sa.subject,
    }));
  },

  async schedule(
    parent: ResolversParentTypes["Cohort"],
    _args: undefined,
    { authedUser, AuthorizationService, CohortService }: Context
  ) {
    AuthorizationService.assertIsAdmin(authedUser);

    const scheduleMeetings =
      parent.schedule?.length > 0
        ? parent.schedule
        : await CohortService.getSchedule(parent.id);

    return scheduleMeetings.map((scheduledMeeting) => ({
      createdAt: scheduledMeeting.createdAt,
      weekday: scheduledMeeting.weekday,
      subject: scheduledMeeting.subject,
      startTime: scheduledMeeting.startTime,
      endTime: scheduledMeeting.endTime,
      timeZone: scheduledMeeting.timeZone,
    }));
  },
};
