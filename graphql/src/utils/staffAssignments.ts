import {
  EngagementStaffAssignment,
  CohortStaffAssignment,
} from "@prisma/client";
import { differenceBy, intersectionBy } from "lodash";
import { NewStaffAssignment } from "src/schema/__generated__/graphql";
import { EditInputStaffAssignment } from "src/services/engagement";
import { parseId } from "./numbers";
import { fromJust } from "./types";

type ChangeSet = {
  additions: EditInputStaffAssignment[];
  removals: EditInputStaffAssignment[];
  updates: EditInputStaffAssignment[];
};

export function calcStaffChanges(
  existingAssignments: EngagementStaffAssignment[] | CohortStaffAssignment[],
  newAssignments: NewStaffAssignment[]
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
  existingAssignment: EngagementStaffAssignment | CohortStaffAssignment
): EditInputStaffAssignment {
  return {
    userId: existingAssignment.userId,
    assignmentRole: existingAssignment.assignmentRole,
  };
}

function fromNewToInput(
  newAssignment: NewStaffAssignment
): EditInputStaffAssignment {
  return {
    userId: parseId(newAssignment.userId),
    assignmentRole: newAssignment.assignmentRole,
  };
}

function findToDelete({
  existingStaff,
  newStaff,
}: {
  existingStaff: EditInputStaffAssignment[];
  newStaff: EditInputStaffAssignment[];
}) {
  const assignmentsToDelete = differenceBy(
    existingStaff, //The array to inspect
    newStaff, //The values to exclude
    (teacher) => teacher.userId
  );

  return assignmentsToDelete;
}

function findToAdd({
  existingStaff,
  newStaff,
}: {
  existingStaff: EditInputStaffAssignment[];
  newStaff: EditInputStaffAssignment[];
}) {
  const assignmentsToAdd = differenceBy(
    newStaff, //The array to inspect
    existingStaff, //The values to exclude
    (teacher) => teacher.userId
  );

  return assignmentsToAdd;
}

function findToUpdate({
  existingStaff,
  newStaff,
}: {
  existingStaff: EditInputStaffAssignment[];
  newStaff: EditInputStaffAssignment[];
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

    return existingTeacher.assignmentRole !== newTeacher.assignmentRole;
  });

  return assignmentsToUpdate;
}
