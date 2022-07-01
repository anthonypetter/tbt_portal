import { AssignmentSubject } from "@generated/graphql";
import { FieldError } from "components/FieldError";
import React, { useState } from "react";
import { EmptyStaffingState } from "./EmptyStaffingState";
import { SearchTeachersInput, TeacherSelection } from "./SearchTeachersInput";
import { isCohortStaffTeacher, StaffAssignment } from "./StaffAssignment";
import { Assignment, CohortAssignment, TeacherAssignmentType } from "./types";

type Props = {
  staff: CohortStaffTeacher[];
  onAdd: (teacher: CohortStaffTeacher) => void;
  onRemove: (teacher: CohortStaffTeacher) => void;
};

export function AssignCohortTeachers({ staff, onAdd, onRemove }: Props) {
  const [error, setError] = useState<string | null>(null);

  const assignmentOptions: CohortAssignment[] = [
    {
      type: TeacherAssignmentType.Cohort,
      subject: AssignmentSubject.Math,
      displayName: "Math",
    },
    {
      type: TeacherAssignmentType.Cohort,
      subject: AssignmentSubject.Ela,
      displayName: "ELA",
    },
    {
      type: TeacherAssignmentType.Cohort,
      subject: AssignmentSubject.General,
      displayName: "General",
    },
  ];

  return (
    <div className="flex flex-col">
      <div>
        <SearchTeachersInput
          options={assignmentOptions}
          onSelect={() => setError(null)}
          onClickAdd={(teacher, assignmentType) => {
            if (!teacher) {
              setError("Please select a teacher.");
              return;
            }

            if (isCohortAssignment(assignmentType)) {
              const selectionKey = `${teacher.userId}_${assignmentType.subject}`;
              const keys = staff.map((t) => `${t.userId}_${t.subject}`);

              if (keys.includes(selectionKey)) {
                setError(
                  "This teacher has already been assigned to this subject!"
                );
                return;
              }

              setError(null);
              onAdd({ ...teacher, subject: assignmentType.subject });
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
                  key={`${teacher.userId}_${teacher.subject}`}
                  teacher={teacher}
                  onRemove={(teacher) => {
                    if (isCohortStaffTeacher(teacher)) {
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

export type CohortStaffTeacher = TeacherSelection & {
  subject: AssignmentSubject;
};

function isCohortAssignment(
  assignment: Assignment
): assignment is CohortAssignment {
  return assignment.type === TeacherAssignmentType.Cohort;
}
