import { prisma } from "../lib/prisma-client";
import { Engagement } from "@prisma/client";

export const CohortService = {
  // TODO: Fix pagination
  async getCohorts(engagementId: number) {
    const engagements = await prisma.cohort.findMany({
      take: 100,
      where: { engagementId },
      // include: { staffAssignments: true },
    });

    return engagements;
  },
};
