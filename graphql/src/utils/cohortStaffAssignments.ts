import { CohortStaffAssignment, AssignmentSubject } from "@prisma/client";
import { intersectionBy } from "lodash";
import { NewCohortStaffAssignment } from "src/schema/__generated__/graphql";
import { parseId } from "./numbers";
import { findToAdd, findToDelete } from "./staffAssignments";
import { fromJust } from "./types";

export type ChangeSet = {
  additions: CohortStaffAssignmentInput[];
  removals: CohortStaffAssignmentInput[];
  updates: CohortStaffAssignmentInput[];
};

export type CohortStaffAssignmentInput = {
  userId: number;
  subject: AssignmentSubject;
};

export function calcStaffChanges(
  existingAssignments: CohortStaffAssignment[],
  newAssignments: NewCohortStaffAssignment[]
): ChangeSet {
  const existingStaff = existingAssignments.map((a) => fromExistingToInput(a));
  const newStaff = newAssignments.map((a) => fromNewToInput(a));

  return {
    additions: findToAdd({ existingStaff, newStaff }),
    removals: findToDelete({ existingStaff, newStaff }),
    updates: findToUpdate({ existingStaff, newStaff }),
  };
}

function fromExistingToInput(
  existingAssignment: CohortStaffAssignment
): CohortStaffAssignmentInput {
  return {
    userId: existingAssignment.userId,
    subject: existingAssignment.subject,
  };
}

export function fromNewToInput(
  newAssignment: NewCohortStaffAssignment
): CohortStaffAssignmentInput {
  return {
    userId: parseId(newAssignment.userId),
    subject: newAssignment.subject,
  };
}

function findToUpdate({
  existingStaff,
  newStaff,
}: {
  existingStaff: CohortStaffAssignmentInput[];
  newStaff: CohortStaffAssignmentInput[];
}) {
  const staffInBothArrays = intersectionBy(
    newStaff,
    existingStaff,
    (teacher) => teacher.userId
  );

  //Now lets figure out if their subject changed.
  const assignmentsToUpdate = staffInBothArrays.filter((assignment) => {
    const existingTeacher = fromJust(
      existingStaff.find((t) => t.userId === assignment.userId),
      "existingTeacher"
    );

    const newTeacher = fromJust(
      newStaff.find((t) => t.userId === assignment.userId),
      "newTeacher"
    );

    return existingTeacher.subject !== newTeacher.subject;
  });

  return assignmentsToUpdate;
}
