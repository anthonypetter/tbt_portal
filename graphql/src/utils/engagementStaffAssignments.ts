import { NewEngagementStaffAssignment } from "@generated/graphql";
import { AssignmentRole, EngagementStaffAssignment } from "@prisma/client";
import differenceWith from "lodash/differenceWith";
import { parseId } from "./numbers";
export type ChangeSet = {
  additions: EngagementStaffAssignmentInput[];
  removals: EngagementStaffAssignmentInput[];
};

export type EngagementStaffAssignmentInput = {
  userId: number;
  role: AssignmentRole;
};

export function calcStaffChanges(
  existingAssignments: EngagementStaffAssignment[],
  newAssignments: NewEngagementStaffAssignment[]
): ChangeSet {
  const existingStaff = existingAssignments.map((a) => fromExistingToInput(a));
  const newStaff = newAssignments.map((a) => fromNewToInput(a));

  return {
    additions: findToAdd({ existingStaff, newStaff }),
    removals: findToDelete({ existingStaff, newStaff }),
  };
}

function fromExistingToInput(
  existingAssignment: EngagementStaffAssignment
): EngagementStaffAssignmentInput {
  return {
    userId: existingAssignment.userId,
    role: existingAssignment.role,
  };
}

export function fromNewToInput(
  newAssignment: NewEngagementStaffAssignment
): EngagementStaffAssignmentInput {
  return {
    userId: parseId(newAssignment.userId),
    role: newAssignment.role,
  };
}

export function findToAdd({
  existingStaff,
  newStaff,
}: {
  existingStaff: EngagementStaffAssignmentInput[];
  newStaff: EngagementStaffAssignmentInput[];
}) {
  const assignmentsToAdd = differenceWith(
    newStaff, //The array to inspect
    existingStaff, //The values to exclude
    (teacherA, teacherB) =>
      teacherA.userId === teacherB.userId && teacherA.role === teacherB.role
  );

  return assignmentsToAdd;
}

export function findToDelete({
  existingStaff,
  newStaff,
}: {
  existingStaff: EngagementStaffAssignmentInput[];
  newStaff: EngagementStaffAssignmentInput[];
}) {
  const assignmentsToDelete = differenceWith(
    existingStaff, //The array to inspect
    newStaff, //The values to exclude
    (teacherA, teacherB) =>
      teacherA.userId === teacherB.userId && teacherA.role === teacherB.role
  );

  return assignmentsToDelete;
}
