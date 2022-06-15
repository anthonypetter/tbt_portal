import { gql } from "@apollo/client";
import { CalendarIcon } from "@heroicons/react/outline";
import { useState } from "react";

import { CohortForDetailsSidebarFragment } from "@generated/graphql";
import { AssignmentSubjectBadge } from "components/AssignmentSubjectBadge";
import { DateText } from "components/Date";
import { DetailsAside } from "components/DetailsAside";
import { CohortsScheduleCalendarModal } from "./scheduleCalendar/CohortsScheduleCalendarModal";
import { Routes } from "@utils/routes";
import { Link } from "components/Link";
import { getRoomUrl } from "@utils/roomUrls";

const DEV_SHOW_SCHEDULE_BUTTON = false;

CohortDetailsSidebar.fragments = {
  cohort: gql`
    fragment CohortForDetailsSidebar on Cohort {
      name
      startDate
      endDate
      grade
      meetingRoom
      hostKey
      createdAt
      staffAssignments {
        user {
          id
          fullName
        }
        subject
      }
      ...CohortForScheduleCalendarModal
    }
    ${CohortsScheduleCalendarModal.fragments.cohort}
  `,
};

type DetailsSidebarProps = {
  selectedCohort: CohortForDetailsSidebarFragment | null;
  onClose: () => void;
};

export function CohortDetailsSidebar({
  selectedCohort,
  onClose,
}: DetailsSidebarProps) {
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  if (!selectedCohort) {
    return <DetailsAside isOpen={false} onClose={onClose} />;
  }
  return (
    <>
      <DetailsAside isOpen={true} onClose={onClose} title={selectedCohort.name}>
        <DetailsAside.Section title="Details">
          <DetailsAside.Line
            label="Starts"
            value={<DateText timeMs={selectedCohort.startDate} />}
          />
          <DetailsAside.Line
            label="Ends"
            value={<DateText timeMs={selectedCohort.endDate} />}
          />
          <DetailsAside.Line label="Grade" value={selectedCohort.grade} />
          <DetailsAside.Line
            label="Meeting Room"
            value={
              selectedCohort.meetingRoom ? (
                <div>
                  <Link href={getRoomUrl(selectedCohort.meetingRoom).backDoor}>
                    <p className="text-ellipsis text-blue-400 truncate">
                      Backdoor Link
                    </p>
                  </Link>

                  <Link
                    href={
                      getRoomUrl(
                        Routes.cohortRoom.href(selectedCohort.meetingRoom)
                      ).host
                    }
                  >
                    <p className="text-ellipsis text-blue-400 truncate">
                      Host Link
                    </p>
                  </Link>
                  <Link
                    href={
                      getRoomUrl(
                        Routes.cohortRoom.href(selectedCohort.meetingRoom)
                      ).student
                    }
                  >
                    <p className="text-ellipsis text-blue-400 truncate">
                      Student Link
                    </p>
                  </Link>
                </div>
              ) : (
                ""
              )
            }
          />
          <DetailsAside.Line label="Host key" value={selectedCohort.hostKey} />
          <DetailsAside.Line
            label="Created"
            value={<DateText timeMs={selectedCohort.createdAt} />}
          />
          {DEV_SHOW_SCHEDULE_BUTTON && (
            <DetailsAside.Line
              label="Schedule"
              value={
                <button
                  className="group flex items-center px-4 py-2 w-full text-sm font-medium"
                  onClick={() => setShowScheduleModal(true)}
                >
                  <CalendarIcon className="mr-3 w-4 h-4" aria-hidden="true" />
                  Show
                </button>
              }
            />
          )}
        </DetailsAside.Section>
        <DetailsAside.Section title="Staff">
          {selectedCohort.staffAssignments.length === 0 ? (
            <p className="py-2 text-sm font-medium text-gray-500 italic">
              Teachers not yet assigned.
            </p>
          ) : (
            selectedCohort.staffAssignments.map((assignment) => (
              <DetailsAside.Line
                key={`${assignment.user.id}-${assignment.subject}`}
                label={assignment.user.fullName}
                value={<AssignmentSubjectBadge subject={assignment.subject} />}
              />
            ))
          )}
        </DetailsAside.Section>
      </DetailsAside>
      <CohortsScheduleCalendarModal
        show={showScheduleModal}
        closeModal={() => setShowScheduleModal(false)}
        cohorts={[selectedCohort]}
      />
    </>
  );
}
