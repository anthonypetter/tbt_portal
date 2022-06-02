import { AssignmentRole, AssignmentSubject } from "@generated/graphql";

export enum TeacherAssignmentType {
  Engagement = "ENGAGEMENT",
  Cohort = "COHORT",
}

export type EngagementAssignment = {
  type: TeacherAssignmentType.Engagement;
  role: AssignmentRole;
  displayName: string;
};

export type CohortAssignment = {
  type: TeacherAssignmentType.Cohort;
  subject: AssignmentSubject;
  displayName: string;
};

export type Assignment = EngagementAssignment | CohortAssignment;
