import { gql } from "@apollo/client";
import { TeacherCohortsPanel_CohortFragment } from "@generated/graphql";
import { CalendarIcon } from "@heroicons/react/outline";
import { formatGrade } from "@utils/strings";
import { AssignmentSubjectBadge } from "components/AssignmentSubjectBadge";
import { CohortsScheduleCalendarModal } from "components/cohorts/scheduleCalendar/CohortsScheduleCalendarModal";
import { Container } from "components/Container";
import { StartEndDateRangeText } from "components/StartEndDateRangeText";
import sortBy from "lodash/sortBy";
import uniq from "lodash/uniq";
import React, { useState } from "react";
import { MdGrade, MdWorkspacesOutline } from "react-icons/md";

TeacherCohortsPanel.fragments = {
  cohort: gql`
    fragment TeacherCohortsPanel_Cohort on Cohort {
      id
      name
      grade
      meetingRoom
      startDate
      endDate
      staffAssignments {
        user {
          fullName
        }
        subject
      }
      engagement {
        name
      }
      ...CohortForScheduleCalendarModal
    }
    ${CohortsScheduleCalendarModal.fragments.cohort}
  `,
};

export function TeacherCohortsPanel({
  title,
  teacherCohorts,
}: {
  title: string;
  teacherCohorts: TeacherCohortsPanel_CohortFragment[];
}) {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [cohortIdForCalendar, setCohortIdForCalendar] = useState<string | null>(
    null
  );

  const cohortForCalendar = teacherCohorts.find(
    (e) => e.id === cohortIdForCalendar
  );

  return (
    <Container>
      <h2
        className="text-base font-medium text-gray-900"
        id="teacher-cohorts-title"
      >
        {title}
      </h2>
      <div className="flow-root mt-2">
        <ul role="list" className="divide-y divide-gray-200">
          {teacherCohorts.length === 0 ? (
            <span className="text-base font-medium text-gray-500">
              No cohorts assigned
            </span>
          ) : (
            teacherCohorts.map((cohort) => {
              const subjects = sortBy(
                uniq(cohort.staffAssignments.map((sa) => sa.subject))
              );

              return (
                <li key={cohort.id}>
                  <div className="block">
                    <div className="py-4">
                      <div className="flex items-center justify-between">
                        <p className="flex items-center">
                          <span className="text-sm font-bold text-gray-900">
                            {cohort.name}
                          </span>
                          <span className="flex items-center text-sm text-gray-500 ml-6">
                            <MdGrade
                              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                            {cohort.grade ? formatGrade(cohort.grade) : ""}
                          </span>
                        </p>

                        <div className="ml-2 flex-shrink-0 flex">
                          {subjects.map((s) => (
                            <AssignmentSubjectBadge
                              key={s}
                              subject={s}
                              className="mr-2"
                            />
                          ))}
                        </div>
                      </div>
                      <div className="mt-4 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            <MdWorkspacesOutline
                              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                            {cohort.engagement.name}
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            <CalendarIcon
                              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                            <StartEndDateRangeText
                              startDateMs={cohort.startDate}
                              endDateMs={cohort.endDate}
                            />
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-blue-500 sm:mt-0">
                          <button
                            className="flex items-center text-sm font-medium"
                            onClick={() => {
                              setCohortIdForCalendar(cohort.id);
                              setShowScheduleModal(true);
                            }}
                          >
                            <CalendarIcon
                              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                            Calendar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </div>

      <CohortsScheduleCalendarModal
        show={showScheduleModal}
        closeModal={() => setShowScheduleModal(false)}
        afterLeave={() => setCohortIdForCalendar(null)}
        cohorts={cohortForCalendar ? [cohortForCalendar] : []}
      />
    </Container>
  );
}
