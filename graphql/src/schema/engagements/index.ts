import { gql } from "apollo-server";
import { EngagementResolver } from "./EngagementResolver";
import { Context } from "../../context";
import {
  MutationEditEngagementArgs,
  NewStaffAssignment,
} from "../__generated__/graphql";
import { parseId } from "../../utils/numbers";
import { EngagementStaffAssignment } from "@prisma/client";
import { fromJust } from "../../utils/types";
import { EditInputStaffAssignment } from "../../services/engagement";
import differenceBy from "lodash/differenceBy";
import intersectionBy from "lodash/intersectionBy";

/**
 * Type Defs
 */

export const typeDefs = gql`
  enum AssignmentRole {
    MENTOR_TEACHER
    SUBSTITUTE_TEACHER
    GENERAL_TEACHER
  }

  type StaffAssignment {
    user: User!
    assignmentRole: AssignmentRole!
  }

  type Engagement {
    id: ID!
    createdAt: Date!
    name: String!
    startDate: Date
    endDate: Date
    organizationId: ID!
    cohorts: [Cohort!]!
    staffAssignments: [StaffAssignment!]!
  }

  input NewStaffAssignment {
    userId: ID!
    assignmentRole: AssignmentRole!
  }

  input EditEngagementInput {
    id: ID!
    name: String
    startDate: Date
    endDate: Date
    newStaffAssignments: [NewStaffAssignment!]
  }

  extend type Mutation {
    editEngagement(input: EditEngagementInput!): Engagement!
  }
`;

/**
 * Mutation resolvers
 */

async function editEngagement(
  _parent: undefined,
  { input }: MutationEditEngagementArgs,
  { authedUser, AuthorizationService, EngagementService }: Context
) {
  AuthorizationService.assertIsAdmin(authedUser);
  // We allow name to come in undefined (represents when the user is not trying to update the name field)
  // But if name *does* come in, we don't allow it to be null.
  // Not quite sure how to represent this in graphql schema yet.
  if (input.name == null) {
    throw new Error("Engagement name cannot be null.");
  }

  const engagementId = parseId(input.id);

  let staffChangeSet;
  if (input.newStaffAssignments) {
    const existingEngagement = fromJust(
      await EngagementService.getEngagement(engagementId),
      "existingEngagement"
    );

    staffChangeSet = calcStaffChanges(
      existingEngagement.staffAssignments,
      input.newStaffAssignments
    );
  }

  // Update engagement
  const updatedStaffAssignment = await EngagementService.editEngagement({
    id: engagementId,
    name: input.name,
    startDate: input.startDate,
    endDate: input.endDate,
    staffChangeSet,
  });

  return updatedStaffAssignment;
}

/**
 * Resolvers
 */

export const resolvers = {
  Mutation: {
    editEngagement,
  },
  Engagement: EngagementResolver,
};

/**
 * changes
 */

type ChangeSet = {
  additions: EditInputStaffAssignment[];
  removals: EditInputStaffAssignment[];
  updates: EditInputStaffAssignment[];
};

function calcStaffChanges(
  existingAssignments: EngagementStaffAssignment[],
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

/**
 * These utilities help format incoming data to prisma formatted data.
 * They also allow us to compare existing vs incoming more easily.
 */

function fromExistingToInput(
  existingAssignment: EngagementStaffAssignment
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
