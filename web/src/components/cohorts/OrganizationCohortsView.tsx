import { gql } from "@apollo/client";
import { Cohort, OrgDetailPageCohortsQuery } from "@generated/graphql";
import { SearchIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import { DateText } from "components/Date";
import { Input } from "components/Input";
import { useState } from "react";
import { CohortsTable } from "./CohortsTable";
import filter from "lodash/filter";
import { DetailsAside } from "components/DetailsAside";
import { AssignmentSubjectBadge } from "components/AssignmentSubjectBadge";
import { ErrorBoundary } from "components/ErrorBoundary";
import { ErrorBox } from "components/ErrorBox";
import { CohortDetailsSidebar } from "./CohortDetailsSidebar";

OrganizationCohortsView.fragments = {
  cohortsList: gql`
    fragment CohortsViewListF on Organization {
      engagements {
        id
        name
        startDate
        endDate
        organizationId
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
          engagementId
          staffAssignments {
            user {
              id
              fullName
              email
            }
            subject
          }
        }
      }
    }
  `,
};

export type QueryCohorts = NonNullable<
  OrgDetailPageCohortsQuery["organization"]
>["engagements"][number]["cohorts"];

type Props = {
  organization: NonNullable<OrgDetailPageCohortsQuery["organization"]>;
};

export function OrganizationCohortsView({ organization }: Props) {
  const [selectedCohortId, setSelectedCohortId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const cohorts = organization.engagements.flatMap((e) => e.cohorts);

  const filteredCohorts = searchTerm
    ? filter(cohorts, (c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : cohorts;

  const selectedCohort =
    filteredCohorts.find((e) => e.id === selectedCohortId) ?? null;

  return (
    <ErrorBoundary fallbackRender={() => <ErrorBox className="mt-4" />}>
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
                organizationId={organization.id}
                cohorts={filteredCohorts}
                onRowClick={(id) => setSelectedCohortId(id)}
                selectedCohort={selectedCohort}
              />
            </main>

            {/* <DetailsSidebar
              selectedCohort={selectedCohort}
              onClose={() => setSelectedCohortId(null)}
            /> */}
            <CohortDetailsSidebar
              selectedCohort={selectedCohort as Cohort}
              onClose={() => setSelectedCohortId(null)}
            />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

type DetailsSidebarProps = {
  selectedCohort: QueryCohorts[number] | null;
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
              value={<AssignmentSubjectBadge subject={assignment.subject} />}
            />
          ))
        )}
      </DetailsAside.Section>
    </DetailsAside>
  );
}
