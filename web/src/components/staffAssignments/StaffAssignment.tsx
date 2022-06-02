import { XIcon } from "@heroicons/react/outline";
import { AssignmentRoleBadge } from "components/AssignmentRoleBadge";
import { AssignmentSubjectBadge } from "components/AssignmentSubjectBadge";
import { Avatar } from "components/Avatar";
import React from "react";
import { CohortStaffTeacher } from "./AssignCohortTeachers";
import { EngagementStaffTeacher } from "./AssignEngagementTeachers";

export function StaffAssignment({
  teacher,
  onRemove,
}: {
  teacher: EngagementStaffTeacher | CohortStaffTeacher;
  onRemove: (remove: EngagementStaffTeacher | CohortStaffTeacher) => void;
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
        {isEngagementStaffTeacher(teacher) ? (
          <AssignmentRoleBadge role={teacher.role} />
        ) : (
          <AssignmentSubjectBadge subject={teacher.subject} />
        )}
        <button onClick={() => onRemove(teacher)}>
          <XIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </button>
      </div>
    </li>
  );
}

export function isEngagementStaffTeacher(
  teacher: EngagementStaffTeacher | CohortStaffTeacher
): teacher is EngagementStaffTeacher {
  return (teacher as EngagementStaffTeacher).role !== undefined;
}

export function isCohortStaffTeacher(
  teacher: EngagementStaffTeacher | CohortStaffTeacher
): teacher is CohortStaffTeacher {
  return (teacher as CohortStaffTeacher).subject !== undefined;
}
