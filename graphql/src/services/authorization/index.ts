import { User, UserRole } from "@prisma/client";

export const AuthorizationService = {
  isAdmin(user: User): boolean {
    return user.role === UserRole.ADMIN;
  },

  assertIsAdmin(user: User) {
    if (!AuthorizationService.isAdmin(user)) {
      throw new Error("User is not authorized to perform this function.");
    }
    return true;
  },
};
