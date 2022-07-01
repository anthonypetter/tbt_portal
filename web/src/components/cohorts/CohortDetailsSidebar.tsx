import { gql } from "@apollo/client";
import { CohortDetailsSidebar_CohortFragment } from "@generated/graphql";
import { CalendarIcon } from "@heroicons/react/outline";
import { getRoomUrl } from "@utils/roomUrls";
import { Routes } from "@utils/routes";
import { AssignmentSubjectBadge } from "components/AssignmentSubjectBadge";
import { DetailsAside } from "components/DetailsAside";
import { Link } from "components/Link";
import { NormalizedDateText } from "components/NormalizedDateText";
import { useState } from "react";
import { CohortsScheduleCalendarModal } from "./scheduleCalendar/CohortsScheduleCalendarModal";

const DEV_SHOW_SCHEDULE_BUTTON = true;

CohortDetailsSidebar.fragments = {
  cohort: gql`
    fragment CohortDetailsSidebar_Cohort on Cohort {
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
  selectedCohort: CohortDetailsSidebar_CohortFragment | null;
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
            value={
              selectedCohort.meetingRoom ? (
                <div>
                  <Link href={getRoomUrl(selectedCohort.meetingRoom).backDoor}>
                    <p className="text-ellipsis text-blue-400 truncate">
                      Backdoor Link
                    </p>
                  </Link>

                  <Link
                    href={Routes.cohortRoom.href(selectedCohort.id, "host")}
                  >
                    <p className="text-ellipsis text-blue-400 truncate">
                      Host Link
                    </p>
                  </Link>
                  <Link
                    href={Routes.cohortRoom.href(
                      selectedCohort.id,
                      "student",
                      selectedCohort.meetingRoom
                    )}
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
          <DetailsAside.Line
            label="Host key"
            value={
              selectedCohort.hostKey ? (
                <div
                  onClick={() =>
                    navigator.clipboard.writeText(`${selectedCohort.hostKey}`)
                  }
                  className="cursor-pointer transition duration-150 ease-in-out"
                >
                  <p
                    data-bs-toggle="tooltip"
                    title="Click here to copy the token"
                  >
                    {selectedCohort.hostKey?.slice(0, 12)}...
                  </p>
                </div>
              ) : (
                ""
              )
            }
          />
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
