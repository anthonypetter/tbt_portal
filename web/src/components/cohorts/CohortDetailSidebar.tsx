import {
  Cohort,
  EngagementDetailsPageCohortsFragment,
} from "@generated/graphql";
import { getRoomUrl } from "@utils/roomUrls";
import { Routes } from "@utils/routes";
import { AssignmentSubjectBadge } from "components/AssignmentSubjectBadge";
import { DateText } from "components/Date";
import { DetailsAside } from "components/DetailsAside";
import { Link } from "components/Link";
import { QueryCohorts } from "./OrganizationCohortsView";

type Props = {
  selectedCohort:
    | Cohort
    | EngagementDetailsPageCohortsFragment["cohorts"][number]
    | QueryCohorts[number]
    | null;
  onClose: () => void;
};

export function CohortDetailSidebar({ selectedCohort, onClose }: Props) {
  if (!selectedCohort) {
    return <DetailsAside isOpen={false} onClose={onClose} />;
  }

  return (
    <DetailsAside isOpen={true} onClose={onClose} title={selectedCohort?.name}>
      <DetailsAside.Section title="Details">
        <DetailsAside.Line
          label="Starts"
          value={<DateText timeMs={selectedCohort?.startDate} />}
        />
        <DetailsAside.Line
          label="Ends"
          value={<DateText timeMs={selectedCohort?.endDate} />}
        />
        <DetailsAside.Line label="Grade" value={selectedCohort?.grade} />
        <DetailsAside.Line
          label="Meeting Room"
          value={
            selectedCohort.meetingRoom ? (
              <div>
                <Link href={selectedCohort.meetingRoom}>
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
        <DetailsAside.Line label="Host key" value={selectedCohort?.hostKey} />
        <DetailsAside.Line
          label="Created"
          value={<DateText timeMs={selectedCohort?.createdAt} />}
        />
      </DetailsAside.Section>
      <DetailsAside.Section title="Staff">
        {selectedCohort?.staffAssignments.length === 0 ? (
          <p className="py-2 text-sm font-medium text-gray-500 italic">
            Teachers not yet assigned.
          </p>
        ) : (
          selectedCohort?.staffAssignments.map((assignment) => (
            <DetailsAside.Line
              key={`${assignment.user.id}-${assignment.subject}`}
              label={assignment.user.fullName}
              value={<AssignmentSubjectBadge subject={assignment.subject} />}
            />
          ))
        )}
      </DetailsAside.Section>
    </DetailsAside>
  );
}
