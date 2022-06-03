import { gql } from "@apollo/client";
import { EngagementDetailPageQuery } from "@generated/graphql";
import { PlusIcon, SearchIcon } from "@heroicons/react/outline";
import { DateText } from "components/Date";
import { Input } from "components/Input";
import { useState } from "react";
import { CohortsTable } from "./CohortsTable";
import filter from "lodash/filter";
import { DetailsAside } from "components/DetailsAside";
import { AssignmentSubjectBadge } from "components/AssignmentSubjectBadge";
import { Button } from "components/Button";
import { AddNewCohortModal } from "./AddNewCohortModal";
import { ErrorBox } from "components/ErrorBox";
import { ErrorBoundary } from "components/ErrorBoundary";

EngagementCohortsView.fragments = {
  cohortsList: gql`
    fragment EngagementCohortsView on Engagement {
      ...CohortsTable
    }
    ${CohortsTable.fragments.cohortsTable}
  `,
};

export type QueryEngagement = NonNullable<
  EngagementDetailPageQuery["engagement"]
>;

type Props = {
  engagement: QueryEngagement;
};

export function EngagementCohortsView({ engagement }: Props) {
  const [selectedCohortId, setSelectedCohortId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredCohorts = searchTerm
    ? filter(engagement.cohorts, (c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : engagement.cohorts;

  const selectedCohort =
    filteredCohorts.find((e) => e.id === selectedCohortId) ?? null;

  return (
    <ErrorBoundary fallbackRender={() => <ErrorBox className="mt-4" />}>
      <div className="flex min-h-full">
        <main className="flex-1">
          <div className="flex justify-between my-4">
            <div className="flex-1 lg:max-w-sm lg:mr-2 lg:ml-1">
              <Input
                id="cohorts-search"
                type="search"
                placeholder="Search"
                leftIcon={SearchIcon}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Button
              type="button"
              theme="tertiary"
              className="mx-2"
              onClick={() => setShowAddModal(true)}
            >
              <PlusIcon
                className="-ml-2 mr-1 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <span>Add</span>
            </Button>
            {/* <UploadCsvButton /> */}
          </div>

          <CohortsTable
            organizationId={engagement.organization.id}
            cohorts={filteredCohorts}
            onRowClick={(id) => setSelectedCohortId(id)}
            selectedCohort={selectedCohort}
          />

          <AddNewCohortModal
            engagementId={engagement.id}
            show={showAddModal}
            onCancel={() => setShowAddModal(false)}
            onSuccess={() => setShowAddModal(false)}
          />
        </main>

        <DetailsSidebar
          selectedCohort={selectedCohort}
          onClose={() => setSelectedCohortId(null)}
        />
      </div>
    </ErrorBoundary>
  );
}

type DetailsSidebarProps = {
  selectedCohort: QueryEngagement["cohorts"][number] | null;
  onClose: () => void;
};

function DetailsSidebar({ selectedCohort, onClose }: DetailsSidebarProps) {
  console.log("selectedCohort", selectedCohort);
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
