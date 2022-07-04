import { gql } from "@apollo/client";
import { CohortDetailsView_CohortFragment } from "@generated/graphql";
import { CalendarIcon } from "@heroicons/react/outline";
import { ClipboardCopyIcon } from "@heroicons/react/solid";
import { Routes } from "@utils/routes";
import { formatGrade } from "@utils/strings";
import { Details } from "components/Details";
import { ErrorBoundary } from "components/ErrorBoundary";
import { ErrorBox } from "components/ErrorBox";
import { Link } from "components/Link";
import { useState } from "react";
import { CohortsScheduleCalendarModal } from "../scheduleCalendar/CohortsScheduleCalendarModal";

CohortDetailsView.fragments = {
  cohort: gql`
    fragment CohortDetailsView_Cohort on Cohort {
      id
      name
      createdAt
      startDate
      endDate
      grade
      meetingRoom
      hostKey
      meetingId
      engagement {
        id
        name
        organization {
          id
          name
        }
      }
      ...CohortForScheduleCalendarModal
    }
    ${CohortsScheduleCalendarModal.fragments.cohort}
  `,
};

type Props = {
  cohort: CohortDetailsView_CohortFragment;
};

export function CohortDetailsView({ cohort }: Props) {
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  return (
    <ErrorBoundary fallbackRender={() => <ErrorBox className="mt-4" />}>
      <div className="flex-1 my-4">
        <Details>
          <Details.Line>
            <Details.Term>Organization</Details.Term>
            <Details.Detail>
              <Link
                href={Routes.org.details.href(
                  cohort.engagement.organization.id
                )}
              >
                {cohort.engagement.organization.name}
              </Link>
            </Details.Detail>
          </Details.Line>
          <Details.Line>
            <Details.Term>Engagement</Details.Term>
            <Details.Detail>
              <Link
                href={Routes.engagement.details.href(
                  cohort.engagement.organization.id,
                  cohort.engagement.id
                )}
              >
                {cohort.engagement.name}
              </Link>
            </Details.Detail>
          </Details.Line>
          <Details.Line>
            <Details.Term>Cohort ID</Details.Term>
            <Details.Detail>{cohort.id}</Details.Detail>
          </Details.Line>
          <Details.Line>
            <Details.Term>Created</Details.Term>
            <Details.Detail>
              {new Date(cohort.createdAt).toLocaleString()}
            </Details.Detail>
          </Details.Line>
          <Details.Line>
            <Details.Term>Grade</Details.Term>
            <Details.Detail>
              {cohort.grade ? formatGrade(cohort.grade) : ""}
            </Details.Detail>
          </Details.Line>
          <Details.Line>
            <Details.Term>Host key</Details.Term>
            <Details.Detail>
              {cohort.hostKey ? (
                <div className="flex cursor-pointer transition duration-150 ease-in-out">
                  <p>{cohort.hostKey?.slice(0, 30)}...</p>
                  <button
                    className="flex items-center ml-4"
                    data-bs-toggle="tooltip"
                    title="Click here to copy the token"
                    onClick={() =>
                      navigator.clipboard.writeText(cohort.hostKey ?? "")
                    }
                  >
                    <ClipboardCopyIcon className="h-5 w-5 text-gray-500" />
                    <span className="ml-1 text-xs text-gray-500">Copy</span>
                  </button>
                </div>
              ) : (
                "Host key not available"
              )}
            </Details.Detail>
          </Details.Line>
          <Details.Line>
            <Details.Term>Backdoor Link</Details.Term>
            <Details.Detail>
              {cohort.meetingRoom ? (
                <Link href={cohort.meetingRoom}>
                  <span className="text-ellipsis truncate">Backdoor Link</span>
                </Link>
              ) : (
                "Room has not been created"
              )}
            </Details.Detail>
          </Details.Line>

          <Details.Line>
            <Details.Term>Host Link</Details.Term>
            <Details.Detail>
              {cohort.meetingRoom ? (
                <Link href={Routes.cohortRoom.href(cohort.id, "host")}>
                  <span className="text-ellipsis truncate">Host Link</span>
                </Link>
              ) : (
                "Room has not been created"
              )}
            </Details.Detail>
          </Details.Line>

          <Details.Line>
            <Details.Term>Student Link</Details.Term>
            <Details.Detail>
              {cohort.meetingRoom ? (
                <Link
                  href={Routes.cohortRoom.href(
                    cohort.id,
                    "student",
                    cohort.meetingRoom
                  )}
                >
                  <span className="text-ellipsis truncate">Student Link</span>
                </Link>
              ) : (
                "Room has not been created"
              )}
            </Details.Detail>
          </Details.Line>
          <Details.Line>
            <Details.Term>Schedule</Details.Term>
            <Details.Detail>
              <button
                className="flex items-center text-sm font-medium"
                onClick={() => setShowScheduleModal(true)}
              >
                <CalendarIcon className="mr-3 w-4 h-4" aria-hidden="true" />
                Show
              </button>
            </Details.Detail>
          </Details.Line>
        </Details>
        <CohortsScheduleCalendarModal
          show={showScheduleModal}
          closeModal={() => setShowScheduleModal(false)}
          cohorts={[cohort]}
        />
      </div>
    </ErrorBoundary>
  );
}
