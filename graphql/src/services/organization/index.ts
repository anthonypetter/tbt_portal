import { prisma } from "../../lib/prisma-client";
import { Organization } from "@prisma/client";

export const OrganizationService = {
  // TODO: Fix pagination
  async getOrgs(take: number): Promise<Organization[]> {
    const organizations = await prisma.organization.findMany({ take });
    return organizations;
  },
};
