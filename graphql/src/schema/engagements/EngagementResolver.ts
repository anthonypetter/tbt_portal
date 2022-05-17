import { Context } from "../../context";
import { EngagementService } from "@services/engagement";

// TODO: This is the correct type, but maybe there's a better way to
// extract this type from prisma.
type EngagementParent = Awaited<
  ReturnType<typeof EngagementService.getEngagements>
>[number];

export const EngagementResolver = {
  async cohorts(
    parent: EngagementParent,
    _args: undefined,
    { authedUser, AuthorizationService, CohortService }: Context
  ) {
    AuthorizationService.assertIsAdmin(authedUser);
    return CohortService.getCohorts(parent.id);
  },

  async staffAssignments(
    parent: EngagementParent,
    _args: undefined,
    { authedUser, AuthorizationService }: Context
  ) {
    AuthorizationService.assertIsAdmin(authedUser);

    return parent.staffAssignments.map((sa) => ({
      user: sa.user,
      assignmentRole: sa.assignmentRole,
    }));
  },
};
