import { createCognitoUser } from "@lib/cognito";
import { prisma } from "@lib/prisma-client";
import { AccountStatus, User, UserRole } from "@prisma/client";

const TAKE_LIMIT = 100;

export const UserService = {
  async getUserByCognitoSub(cognitoSub: string): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: {
        cognitoSub,
      },
    });

    return user;
  },

  // TODO: Fix pagination
  async getUsers(): Promise<User[]> {
    const users = await prisma.user.findMany({
      take: TAKE_LIMIT,
      orderBy: [{ fullName: "asc" }],
    });
    return users;
  },

  async inviteUser({
    email,
    fullName,
    role,
  }: {
    email: string;
    fullName: string;
    role: UserRole;
  }): Promise<User> {
    // Search for user in DB.
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // If this user already has a cognitoSub, this user was already invited.
    if (user != null && user.cognitoSub != null) {
      throw new Error("This user has already been invited.");
    }

    const cognitoSub = await createCognitoUser(email);

    // User is already in DB. Let's just update their cognito sub and inviteSentAt.
    if (user != null) {
      return prisma.user.update({
        where: { email },
        data: { cognitoSub, inviteSentAt: new Date() },
      });
    }

    return prisma.user.create({
      data: {
        email,
        fullName,
        cognitoSub,
        createdAt: new Date(),
        inviteSentAt: new Date(),
        role,
        accountStatus: AccountStatus.PENDING,
      },
    });
  },

  async activateUser(user: User) {
    await prisma.user.update({
      where: { email: user.email },
      data: { accountStatus: AccountStatus.ACTIVE },
    });
  },

  accountIsPending(user: User) {
    return user.accountStatus === AccountStatus.PENDING;
  },
};
