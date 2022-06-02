import { AssignmentRole } from "@generated/graphql";
import { FieldError } from "components/FieldError";
import {
  Assignment,
  EngagementAssignment,
  TeacherAssignmentType,
} from "./types";
import { SearchTeachersInput, TeacherSelection } from "./SearchTeachersInput";
import React, { useState } from "react";
import { QueryEngagements } from "../engagements/EngagementsView";
import { EmptyStaffingState } from "./EmptyStaffingState";
import { isEngagementStaffTeacher, StaffAssignment } from "./StaffAssignment";

type Props = {
  staff: EngagementStaffTeacher[];
  onAdd: (teacher: EngagementStaffTeacher) => void;
  onRemove: (teacher: EngagementStaffTeacher) => void;
};

export function AssignEngagementTeachers({ staff, onAdd, onRemove }: Props) {
  const [error, setError] = useState<string | null>(null);

  const assignmentOptions: EngagementAssignment[] = [
    {
      type: TeacherAssignmentType.Engagement,
      role: AssignmentRole.MentorTeacher,
      displayName: "Mentor Teacher",
    },
    {
      type: TeacherAssignmentType.Engagement,
      role: AssignmentRole.SubstituteTeacher,
      displayName: "Substitute Teacher",
    },
    {
      type: TeacherAssignmentType.Engagement,
      role: AssignmentRole.GeneralTeacher,
      displayName: "General Teacher",
    },
  ];

  return (
    <div className="flex flex-col">
      <div>
        <SearchTeachersInput
          onSelect={() => setError(null)}
          options={assignmentOptions}
          onClickAdd={(teacher, assignmentType) => {
            if (!teacher) {
              setError("Please select a teacher.");
              return;
            }

            if (isEngagementAssingment(assignmentType)) {
              const selectionKey = `${teacher.userId}_${assignmentType.role}`;
              const keys = staff.map((t) => `${t.userId}_${t.role}`);

              if (keys.includes(selectionKey)) {
                setError("This teacher has already been assigned!");
                return;
              }

              setError(null);
              onAdd({ ...teacher, role: assignmentType.role });
            }
          }}
        />
      </div>

      <div className="h-6">{error && <FieldError msg={error} />}</div>

      <div className="overflow-y-auto h-64">
        {staff.length === 0 ? (
          <EmptyStaffingState />
        ) : (
          <div className="border-b border-gray-200">
            <ul role="list" className="divide-y divide-gray-200">
              {staff.map((teacher) => (
                <StaffAssignment
                  key={`${teacher.userId}_${teacher.role}`}
                  teacher={teacher}
                  onRemove={(teacher) => {
                    if (isEngagementStaffTeacher(teacher)) {
                      onRemove(teacher);
                    }
                  }}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function isEngagementAssingment(
  assignment: Assignment
): assignment is EngagementAssignment {
  return assignment.type === TeacherAssignmentType.Engagement;
}

export type EngagementStaffTeacher = TeacherSelection & {
  role: AssignmentRole;
};

export function toEngagementStaffTeacher(
  staffAssignment: QueryEngagements[number]["staffAssignments"][number]
): EngagementStaffTeacher {
  return {
    userId: staffAssignment.user.id,
    fullName: staffAssignment.user.fullName,
    email: staffAssignment.user.email,
    role: staffAssignment.role,
  };
}
