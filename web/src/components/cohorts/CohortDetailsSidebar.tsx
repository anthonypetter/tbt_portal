import { Cohort } from "@generated/graphql";
import { CalendarIcon } from "@heroicons/react/outline";
import { AssignmentSubjectBadge } from "components/AssignmentSubjectBadge";
import { DateText } from "components/Date";
import { DetailsAside } from "components/DetailsAside";

type DetailsSidebarProps = {
  selectedCohort: Cohort | null;
  onClose: () => void;
};

export function CohortDetailsSidebar({ selectedCohort, onClose }: DetailsSidebarProps) {
  if (!selectedCohort) {
    return <DetailsAside isOpen={false} onClose={onClose} />;
  }
  return (
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
          value={selectedCohort.meetingRoom}
        />
        <DetailsAside.Line label="Host key" value={selectedCohort.hostKey} />
        <DetailsAside.Line
          label="Created"
          value={<DateText timeMs={selectedCohort.createdAt} />}
        />
        <DetailsAside.Line
          label="Schedule"
          value={(
            <button
              className="group flex items-center px-4 py-2 w-full text-sm font-medium"
              onClick={() => console.log("open!")}
            >
              <CalendarIcon
                className="mr-3 w-4 h-4"
                aria-hidden="true"
              />
              Show
            </button>
          )}
        />
      </DetailsAside.Section>
      <DetailsAside.Section title="Staff">
        {selectedCohort.staffAssignments.length === 0 ? (
          <p className="py-2 text-sm font-medium text-gray-500 italic">
            Teachers not yet assigned.
          </p>
        ) : (
          selectedCohort.staffAssignments.map((assignment) => (
            <DetailsAside.Line
              key={assignment.user.id}
              label={assignment.user.fullName}
              value={<AssignmentSubjectBadge subject={assignment.subject} />}
            />
          ))
        )}
      </DetailsAside.Section>
    </DetailsAside>
  );
}