import { prisma } from "../../lib/prisma-client";
import { User } from "@prisma/client";

export const UserService = {
  async getUserByCognitoSub(cognitoSub: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        cognitoSub,
      },
    });

    return user;
  },

  async getUsers(take: number): Promise<User[]> {
    const users = await prisma.user.findMany({ take });
    return users;
  },
};
