import { prisma } from "../lib/prisma-client";
import { Organization } from "@prisma/client";

const TAKE_LIMIT = 100;

async function getOrganization(id: number): Promise<Organization | null> {
  const organization = await prisma.organization.findFirst({
    where: { id },
  });
  return organization;
}

// TODO: Fix pagination
async function getOrganizations(): Promise<Organization[]> {
  const organizations = await prisma.organization.findMany({
    take: TAKE_LIMIT,
    orderBy: [{ name: "asc" }],
  });
  return organizations;
}

async function addOrganization({
  name,
  description,
  district,
  subDistrict,
}: {
  name: string;
  description?: string | null;
  district?: string | null;
  subDistrict?: string | null;
}): Promise<Organization> {
  const organization = await prisma.organization.create({
    data: {
      name,
      description: description,
      district: district === null ? undefined : district,
      subDistrict: subDistrict === null ? undefined : subDistrict,
    },
  });
  return organization;
}

async function editOrganization({
  id,
  name,
  district,
  subDistrict,
  description,
}: {
  id: number;
  name?: string;
  district?: string | null;
  subDistrict?: string | null;
  description?: string | null;
}): Promise<Organization> {
  const organization = await prisma.organization.update({
    where: { id },
    data: { name, district, subDistrict, description },
  });
  return organization;
}

async function deleteOrganization(id: number): Promise<Organization> {
  const organization = await prisma.organization.delete({
    where: { id },
  });
  return organization;
}

// Prisma will ignore fields that are undefined and will not update them.
export const OrganizationService = {
  getOrganization,
  getOrganizations,
  addOrganization,
  editOrganization,
  deleteOrganization,
};
