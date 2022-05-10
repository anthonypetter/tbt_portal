import { prisma } from "../lib/prisma-client";
import { AccountStatus, User, UserRole } from "@prisma/client";
import { createCognitoUser } from "../lib/cognito";

export const UserService = {
  async getUserByCognitoSub(cognitoSub: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        cognitoSub,
      },
    });

    return user;
  },

  // TODO: Fix pagination
  async getUsers(take: number): Promise<User[]> {
    const users = await prisma.user.findMany({ take });
    return users;
  },

  async inviteUser(
    email: string,
    role: UserRole
  ): Promise<{ success: boolean }> {
    const cognitoSub = await createCognitoUser(email);

    await prisma.user.create({
      data: {
        email,
        cognitoSub,
        createdAt: new Date(),
        role,
        accountStatus: AccountStatus.PENDING,
      },
    });

    return { success: true };
  },

  async activateUser(user: User) {
    await prisma.user.update({
      where: { cognitoSub: user.cognitoSub },
      data: { accountStatus: AccountStatus.ACTIVE },
    });
  },
};
