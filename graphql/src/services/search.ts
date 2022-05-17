import { prisma } from "../lib/prisma-client";

export const SearchService = {
  async searchUsers(query: string) {
    if (query.length < 3) {
      return [];
    }

    return prisma.user.findMany({
      take: 5,
      where: {
        OR: [
          { fullName: { startsWith: query, mode: "insensitive" } },
          { email: { startsWith: query, mode: "insensitive" } },
        ],
      },
      orderBy: { fullName: "asc" },
    });
  },
};
