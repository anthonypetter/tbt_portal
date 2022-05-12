import { prisma } from "../lib/prisma-client";

export const CohortService = {
  // TODO: Fix pagination
  async getCohorts(engagementId: number) {
    const cohorts = await prisma.cohort.findMany({
      take: 100,
      where: { engagementId },
      // include: { staffAssignments: true },
    });

    return cohorts;
  },

  async getCohortsForOrg(orgId: number) {
    const cohorts = await prisma.cohort.findMany({
      take: 100,
      where: { engagement: { organizationId: orgId } },
    });

    return cohorts;
  },
};
