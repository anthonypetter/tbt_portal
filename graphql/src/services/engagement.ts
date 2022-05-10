import { prisma } from "../lib/prisma-client";
import { Engagement } from "@prisma/client";

export const EngagementService = {
  async getEngagement(id: number): Promise<Engagement | null> {
    const engagement = await prisma.engagement.findFirst({
      where: { id },
    });
    return engagement;
  },

  // TODO: Fix pagination
  async getEngagements(organizationId: number) {
    const engagements = await prisma.engagement.findMany({
      take: 100,
      where: { organizationId },
    });

    return engagements;
  },

  async addEngagement({
    name,
    organizationId,
  }: {
    name: string;
    organizationId: number;
  }): Promise<Engagement> {
    const engagement = await prisma.engagement.create({
      data: { name, organizationId },
    });

    return engagement;
  },

  // Prisma will ignore fields that are undefined and will not update them.
  async editEngagement({
    id,
    name,
  }: {
    id: number;
    name?: string;
  }): Promise<Engagement> {
    const engagement = await prisma.engagement.update({
      where: { id },
      data: { name },
    });
    return engagement;
  },

  async deleteEngagement(id: number): Promise<Engagement> {
    const engagement = await prisma.engagement.delete({
      where: { id },
    });
    return engagement;
  },
};
