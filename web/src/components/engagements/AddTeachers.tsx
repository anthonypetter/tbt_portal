import { AssignmentRole } from "@generated/graphql";
import { XIcon, UserGroupIcon } from "@heroicons/react/outline";
import { AssignmentRoleBadge } from "components/AssignmentRoleBadge";
import { Avatar } from "components/Avatar";
import { FieldError } from "components/FieldError";
import {
  SearchTeachersInput,
  TeacherSelection,
} from "components/search/SearchTeachersInput";
import React, { useState } from "react";
import { QueryEngagements } from "./EngagementsView";

type Props = {
  staff: StaffTeacher[];
  onAdd: (teacher: StaffTeacher) => void;
  onRemove: (teacher: StaffTeacher) => void;
};

export function AddTeachers({ staff, onAdd, onRemove }: Props) {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col">
      <div>
        <SearchTeachersInput
          onClickAdd={(
            teacher: TeacherSelection | null,
            assignmentRole: AssignmentRole
          ) => {
            if (!teacher) {
              setError("Please select a teacher.");
              return;
            }

            const selectionKey = `${teacher.userId}_${assignmentRole}`;
            const keys = staff.map((t) => `${t.userId}_${t.assignmentRole}`);

            if (keys.includes(selectionKey)) {
              setError("This teacher has already been assigned!");
              return;
            }

            setError(null);
            onAdd({ ...teacher, assignmentRole });
          }}
          onSelect={() => setError(null)}
        />
      </div>

      <div className="h-6">{error && <FieldError msg={error} />}</div>

      <div className="overflow-y-auto mt-6 h-64">
        {staff.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="border-b border-gray-200">
            <ul role="list" className="divide-y divide-gray-200">
              {staff.map((teacher) => (
                <StaffAssignment
                  key={`${teacher.userId}_${teacher.assignmentRole}`}
                  teacher={teacher}
                  onRemove={(teacher) => onRemove(teacher)}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function StaffAssignment({
  teacher,
  onRemove,
}: {
  teacher: StaffTeacher;
  onRemove: (remove: StaffTeacher) => void;
}): JSX.Element {
  return (
    <li key={teacher.userId} className="py-4 flex justify-between items-center">
      <div className="flex">
        <Avatar />
        <div className="ml-3 flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {teacher.fullName}
          </span>
          <span className="text-sm text-gray-500">{teacher.email}</span>
        </div>
      </div>
      <div className="mr-3 flex items-center">
        <AssignmentRoleBadge assignmentRole={teacher.assignmentRole} />
        <button onClick={() => onRemove(teacher)}>
          <XIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </button>
      </div>
    </li>
  );
}

export type StaffTeacher = TeacherSelection & {
  assignmentRole: AssignmentRole;
};

export function toStaffTeacher(
  staffAssignment: QueryEngagements[number]["staffAssignments"][number]
): StaffTeacher {
  return {
    userId: staffAssignment.user.id,
    fullName: staffAssignment.user.fullName,
    email: staffAssignment.user.email,
    assignmentRole: staffAssignment.assignmentRole,
  };
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center mx-4 mt-8">
      <UserGroupIcon className="h-16 w-16 text-gray-400 text-sm" />
      <h2 className="mt-2 text-lg font-medium text-gray-900">Add teachers</h2>
      <p className="mt-1 text-sm text-gray-500">
        {"You haven't added any teachers to this engagement yet."}
      </p>
    </div>
  );
}
