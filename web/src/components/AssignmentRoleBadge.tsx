import { AssignmentRole } from "@generated/graphql";
import { assertUnreachable } from "@utils/types";
import React from "react";
import { Badge } from "./Badge";

type Props = {
  assignmentRole: AssignmentRole;
};

export function AssignmentRoleBadge({ assignmentRole }: Props) {
  switch (assignmentRole) {
    case AssignmentRole.MentorTeacher:
      return (
        <Badge className="text-green-800 bg-green-100 mr-5">
          Mentor Teacher
        </Badge>
      );

    case AssignmentRole.GeneralTeacher:
      return (
        <Badge className="text-blue-800 bg-blue-100 mr-5">
          General Teacher
        </Badge>
      );

    case AssignmentRole.SubstituteTeacher:
      return (
        <Badge className="text-purple-800 bg-purple-100 mr-5">
          Substitue Teacher
        </Badge>
      );

    default:
      assertUnreachable(assignmentRole);
  }
}
