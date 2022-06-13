import { ResolversParentTypes } from "@generated/graphql";
import { prisma } from "@lib/prisma-client";
import { parseId } from "@utils/numbers";
import { Context } from "src/context";

export const UserResolvers = {
  async engagementAssignments(
    _parent: ResolversParentTypes["User"],
    _args: undefined,
    { authedUser, AuthorizationService }: Context
  ) {
    AuthorizationService.assertIsAdmin(authedUser);
    const assignedEngagements = _parent?.engagementAssignments?.length
      ? _parent.engagementAssignments
      : await prisma.engagementStaffAssignment.findMany({
          where: { userId: parseId(_parent.id) },
          include: { engagement: true },
        });

    return assignedEngagements;
  },

  async cohortAssignments(
    _parent: ResolversParentTypes["User"],
    _args: undefined,
    { authedUser, AuthorizationService }: Context
  ) {
    AuthorizationService.assertIsAdmin(authedUser);
    const assigedCohorts = _parent?.cohortAssignments?.length
      ? _parent.cohortAssignments
      : await prisma.cohortStaffAssignment.findMany({
          where: { userId: parseId(_parent.id) },
          include: { cohort: true },
        });

    return assigedCohorts;
  },
};
