import { User, UserRole } from "@prisma/client";

export const AuthorizationService = {
  isAdmin(user: User): boolean {
    return user.role === UserRole.ADMIN;
  },

  isTutorTeacher(user: User): boolean {
    return user.role === UserRole.TUTOR_TEACHER;
  },

  isMentorTeacher(user: User): boolean {
    return user.role === UserRole.MENTOR_TEACHER;
  },

  assertIsAdmin(user: User) {
    if (!AuthorizationService.isAdmin(user)) {
      throw new Error("User is not authorized to perform this function.");
    }
    return true;
  },

  assertIsStaff(user: User): boolean {
    if (
      !(
        AuthorizationService.isAdmin(user) ||
        AuthorizationService.isTutorTeacher(user) ||
        AuthorizationService.isMentorTeacher(user)
      )
    ) {
      throw new Error("User is not authorized to perform this actioin ");
    }
    return true;
  },
};
