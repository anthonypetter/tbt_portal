import { EngagementStaffAssignment, AssignmentRole } from "@prisma/client";
import intersectionBy from "lodash/intersectionBy";
import { NewEngagementStaffAssignment } from "src/schema/__generated__/graphql";
import { parseId } from "./numbers";
import { findToAdd, findToDelete } from "./staffAssignments";
import { fromJust } from "./types";

export type ChangeSet = {
  additions: StaffAssignmentInput[];
  removals: StaffAssignmentInput[];
  updates: StaffAssignmentInput[];
};

export type StaffAssignmentInput = {
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
    updates: findToUpdate({ existingStaff, newStaff }),
  };
}

function fromExistingToInput(
  existingAssignment: EngagementStaffAssignment
): StaffAssignmentInput {
  return {
    userId: existingAssignment.userId,
    role: existingAssignment.role,
  };
}

export function fromNewToInput(
  newAssignment: NewEngagementStaffAssignment
): StaffAssignmentInput {
  return {
    userId: parseId(newAssignment.userId),
    role: newAssignment.role,
  };
}

function findToUpdate({
  existingStaff,
  newStaff,
}: {
  existingStaff: StaffAssignmentInput[];
  newStaff: StaffAssignmentInput[];
}) {
  const staffInBothArrays = intersectionBy(
    newStaff,
    existingStaff,
    (teacher) => teacher.userId
  );

  //Now lets figure out if their role changed.
  const assignmentsToUpdate = staffInBothArrays.filter((assignment) => {
    const existingTeacher = fromJust(
      existingStaff.find((t) => t.userId === assignment.userId),
      "existingTeacher"
    );

    const newTeacher = fromJust(
      newStaff.find((t) => t.userId === assignment.userId),
      "newTeacher"
    );

    return existingTeacher.role !== newTeacher.role;
  });

  return assignmentsToUpdate;
}
