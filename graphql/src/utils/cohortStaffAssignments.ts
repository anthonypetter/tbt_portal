import { NewCohortStaffAssignment } from "@generated/graphql";
import { AssignmentSubject, CohortStaffAssignment } from "@prisma/client";
import differenceWith from "lodash/differenceWith";
import { parseId } from "./numbers";

export type ChangeSet = {
  additions: CohortStaffAssignmentInput[];
  removals: CohortStaffAssignmentInput[];
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

export function findToDelete({
  existingStaff,
  newStaff,
}: {
  existingStaff: CohortStaffAssignmentInput[];
  newStaff: CohortStaffAssignmentInput[];
}) {
  const assignmentsToDelete = differenceWith(
    existingStaff, //The array to inspect
    newStaff, //The values to exclude
    (teacherA, teacherB) =>
      teacherA.userId === teacherB.userId &&
      teacherA.subject === teacherB.subject
  );

  return assignmentsToDelete;
}

export function findToAdd({
  existingStaff,
  newStaff,
}: {
  existingStaff: CohortStaffAssignmentInput[];
  newStaff: CohortStaffAssignmentInput[];
}) {
  const assignmentsToAdd = differenceWith(
    newStaff, //The array to inspect
    existingStaff, //The values to exclude
    (teacherA, teacherB) =>
      teacherA.userId === teacherB.userId &&
      teacherA.subject === teacherB.subject
  );

  return assignmentsToAdd;
}
