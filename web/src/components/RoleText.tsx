import { UserRole } from "@generated/graphql";
import { assertUnreachable } from "@utils/types";

type Props = {
  role: UserRole;
  className?: string;
};

export function RoleText({ role, className = "text-gray-700" }: Props) {
  const roleText = getDisplayText(role);
  return <span className={className}>{roleText}</span>;
}

function getDisplayText(role: UserRole) {
  switch (role) {
    case UserRole.Admin:
      return "Administrator";

    case UserRole.MentorTeacher:
      return "Mentor Teacher";

    case UserRole.TutorTeacher:
      return "Tutor Teacher";

    default:
      assertUnreachable(role);
  }
}
