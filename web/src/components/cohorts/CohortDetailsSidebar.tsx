import { gql } from "@apollo/client";
import { CohortForDetailsSidebarFragment } from "@generated/graphql";
import { CalendarIcon } from "@heroicons/react/outline";
import { AssignmentSubjectBadge } from "components/AssignmentSubjectBadge";
import { DetailsAside } from "components/DetailsAside";
import { NormalizedDateText } from "components/NormalizedDateText";
import { useState } from "react";
import { CohortsScheduleCalendarModal } from "./scheduleCalendar/CohortsScheduleCalendarModal";

const DEV_SHOW_SCHEDULE_BUTTON = true;

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
            value={<NormalizedDateText timeMs={selectedCohort.startDate} />}
          />
          <DetailsAside.Line
            label="Ends"
            value={<NormalizedDateText timeMs={selectedCohort.endDate} />}
          />
          <DetailsAside.Line label="Grade" value={selectedCohort.grade} />
          <DetailsAside.Line
            label="Meeting Room"
            value={selectedCohort.meetingRoom}
          />
          <DetailsAside.Line label="Host key" value={selectedCohort.hostKey} />
          <DetailsAside.Line
            label="Created"
            value={<NormalizedDateText timeMs={selectedCohort.createdAt} />}
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
