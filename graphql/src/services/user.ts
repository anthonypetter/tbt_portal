import { prisma } from "../lib/prisma-client";
import { AccountStatus, User, UserRole } from "@prisma/client";
import { createCognitoUser } from "../lib/cognito";

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
    const users = await prisma.user.findMany({ take: TAKE_LIMIT });
    return users;
  },

  async getTeachers(): Promise<User[]> {
    const teachers = await prisma.user.findMany({
      take: TAKE_LIMIT,
      where: {
        role: { in: ["MENTOR_TEACHER", "TUTOR_TEACHER"] },
      },
    });
    return teachers;
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
    const cognitoSub = await createCognitoUser(email);

    const user = await prisma.user.create({
      data: {
        email,
        fullName,
        cognitoSub,
        createdAt: new Date(),
        role,
        accountStatus: AccountStatus.PENDING,
      },
    });

    return user;
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
