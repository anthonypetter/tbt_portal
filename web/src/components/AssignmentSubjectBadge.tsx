import { AssignmentSubject } from "@generated/graphql";
import { assertUnreachable } from "@utils/types";
import React from "react";
import { Badge } from "./Badge";

type Props = {
  subject: AssignmentSubject;
};

export function AssignmentSubjectBadge({ subject }: Props) {
  switch (subject) {
    case AssignmentSubject.Math:
      return <Badge className="text-purple-800 bg-purple-100 mr-5">Math</Badge>;

    case AssignmentSubject.Ela:
      return <Badge className="text-green-800 bg-green-100 mr-5">ELA</Badge>;

    case AssignmentSubject.General:
      return <Badge className="text-blue-800 bg-blue-100 mr-5">General</Badge>;

    default:
      assertUnreachable(subject);
  }
}
