import { UserRole } from "@generated/graphql";
import { assertUnreachable } from "@utils/types";

type Props = {
  role: UserRole;
  className?: string;
};

export function RoleText({ role, className = "text-gray-700" }: Props) {
  const roleText = getTextForRole(role);
  return <span className={className}>{roleText}</span>;
}

export function getTextForRole(role: UserRole): string {
  switch (role) {
    case UserRole.Admin:
      return "Administrator";

    case UserRole.MentorTeacher:
      return "Mentor Teacher";

    case UserRole.TutorTeacher:
      return "Tutor Teacher";

    default:
      return assertUnreachable(role, "role");
  }
}
