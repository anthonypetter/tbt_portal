import { prisma } from "../lib/prisma-client";
import { Organization } from "@prisma/client";

export const OrganizationService = {
  async getOrg(id: number): Promise<Organization | null> {
    const organization = await prisma.organization.findFirst({
      where: { id },
    });
    return organization;
  },

  // TODO: Fix pagination
  async getOrgs(take: number): Promise<Organization[]> {
    const organizations = await prisma.organization.findMany({ take });
    return organizations;
  },

  async addOrg({
    name,
    district,
    subDistrict,
  }: {
    name: string;
    district?: string | null;
    subDistrict?: string | null;
  }): Promise<Organization> {
    const organization = await prisma.organization.create({
      data: {
        name,
        district: district === null ? undefined : district,
        subDistrict: subDistrict === null ? undefined : subDistrict,
      },
    });
    return organization;
  },

  // Prisma will ignore fields that are undefined and will not update them.
  async editOrganization({
    id,
    name,
    district,
    subDistrict,
  }: {
    id: number;
    name?: string;
    district?: string | null;
    subDistrict?: string | null;
  }): Promise<Organization> {
    const organization = await prisma.organization.update({
      where: { id },
      data: { name, district, subDistrict },
    });
    return organization;
  },

  async deleteOrganization(id: number): Promise<Organization> {
    const organization = await prisma.organization.delete({
      where: { id },
    });
    return organization;
  },
};
