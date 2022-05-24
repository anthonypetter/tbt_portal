import { gql } from "@apollo/client";
import { EngagementDetailPageQuery } from "@generated/graphql";
import { SearchIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import { DateText } from "components/Date";
import { Input } from "components/Input";
import { useState } from "react";
import { CohortsTable } from "./CohortsTable";
import filter from "lodash/filter";
import { DetailsAside } from "components/DetailsAside";
import { AssignmentRoleBadge } from "components/AssignmentRoleBadge";

EngagementCohortsView.fragments = {
  cohortsList: gql`
    fragment EngagementCohortsView on Engagement {
      cohorts {
        id
        createdAt
        name
        grade
        meetingRoom
        hostKey
        exempt
        startDate
        endDate
        staffAssignments {
          user {
            id
            fullName
            email
          }
          assignmentRole
        }
      }
    }
  `,
};

export type QueryEngagement = NonNullable<
  EngagementDetailPageQuery["engagement"]
>;

type Props = {
  engagement: QueryEngagement;
};

export function EngagementCohortsView({ engagement }: Props) {
  console.log("engagement", engagement);

  const [selectedCohortId, setSelectedCohortId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const filteredCohorts = searchTerm
    ? filter(engagement.cohorts, (c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : engagement.cohorts;

  const selectedCohort =
    filteredCohorts.find((e) => e.id === selectedCohortId) ?? null;

  return (
    <div className="flex min-h-full">
      <div className={clsx("flex-1 flex flex-col overflow-hidden")}>
        <div className="flex-1 flex items-stretch overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            <div className="flex-1 my-4 lg:max-w-sm lg:mr-2">
              <Input
                id="cohorts-search"
                type="search"
                placeholder="Search"
                leftIcon={SearchIcon}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <CohortsTable
              organizationId={"1"} //TODO: REMOVE
              cohorts={filteredCohorts}
              onRowClick={(id) => setSelectedCohortId(id)}
              selectedCohort={selectedCohort}
            />
          </main>

          <DetailsSidebar
            selectedCohort={selectedCohort}
            onClose={() => setSelectedCohortId(null)}
          />
        </div>
      </div>
    </div>
  );
}

type DetailsSidebarProps = {
  selectedCohort: QueryEngagement["cohorts"][number] | null;
  onClose: () => void;
};

function DetailsSidebar({ selectedCohort, onClose }: DetailsSidebarProps) {
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
              value={
                <AssignmentRoleBadge
                  assignmentRole={assignment.assignmentRole}
                />
              }
            />
          ))
        )}
      </DetailsAside.Section>
    </DetailsAside>
  );
}
