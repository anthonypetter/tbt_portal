import { prisma } from "../lib/prisma-client";

const MIN_QUERY_LENGTH_COHORT = 1
const MIN_QUERY_LENGTH = 3;
const SEARCH_TAKE_LIMIT = 100;

export const SearchService = {
  async searchUsers(query: string) {
    if (query.length < MIN_QUERY_LENGTH) {
      return [];
    }

    return prisma.user.findMany({
      take: SEARCH_TAKE_LIMIT,
      where: {
        OR: [
          { fullName: { startsWith: query, mode: "insensitive" } },
          { email: { startsWith: query, mode: "insensitive" } },
        ],
      },
      orderBy: { fullName: "asc" },
    });
  },

  async searchEngagements(query: string) {
    if (query.length < MIN_QUERY_LENGTH) {
      return [];
    }

    return prisma.engagement.findMany({
      take: SEARCH_TAKE_LIMIT,
      where: {
        OR: [
          { name: { startsWith: query, mode: "insensitive" } },
          {
            organization: { name: { startsWith: query, mode: "insensitive" } },
          },
        ],
      },
      orderBy: { name: "asc" },
    });
  },

  async searchOrganizations(query: string) {
    if (query.length < MIN_QUERY_LENGTH) {
      return [];
    }

    return prisma.organization.findMany({
      take: SEARCH_TAKE_LIMIT,
      where: {
        OR: [
          { name: { startsWith: query, mode: "insensitive" } },
        ],
      },
      orderBy: { name: "asc" },
    });
  },

  async searchCohorts(query: string) {
    if (query.length < MIN_QUERY_LENGTH_COHORT) {
      return [];
    }

    return prisma.cohort.findMany({
      take: SEARCH_TAKE_LIMIT,
      where: {
        OR: [
          { name: { startsWith: query, mode: "insensitive" } },
          {
            engagement: {
              name: { startsWith: query, mode: "insensitive" }
            }
          },
        ],
      },
      orderBy: { name: "asc" },
    });
  },
};
