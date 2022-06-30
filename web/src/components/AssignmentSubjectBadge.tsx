import { AssignmentSubject } from "@generated/graphql";
import { assertUnreachable } from "@utils/types";
import clsx from "clsx";
import React from "react";
import { Badge } from "./Badge";

type Props = {
  subject: AssignmentSubject;
  className?: string;
};

export function AssignmentSubjectBadge({ subject, className }: Props) {
  switch (subject) {
    case AssignmentSubject.Math:
      return (
        <Badge
          className={clsx("text-purple-800 bg-purple-100 mr-5", className)}
        >
          Math
        </Badge>
      );

    case AssignmentSubject.Ela:
      return (
        <Badge className={clsx("text-green-800 bg-green-100 mr-5", className)}>
          ELA
        </Badge>
      );

    case AssignmentSubject.General:
      return (
        <Badge className={clsx("text-blue-800 bg-blue-100 mr-5", className)}>
          General
        </Badge>
      );

    default:
      assertUnreachable(subject);
  }
}
