import { gql } from "@apollo/client";
import { Cohort, EngagementDetailPageQuery } from "@generated/graphql";
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
import { UploadCsvButton } from "./UploadCsvButton";
import { CohortDetailsSidebar } from "./CohortDetailsSidebar";

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
      <div className="flex min-h-[500px]">
        <main className="flex-1">
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 justify-between my-4">
            <div className="flex-1 lg:max-w-sm lg:mr-2 lg:ml-1">
              <Input
                id="cohorts-search"
                type="search"
                placeholder="Search"
                leftIcon={SearchIcon}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <Button
                type="button"
                theme="tertiary"
                className="mr-2 sm:mx-2"
                onClick={() => setShowAddModal(true)}
              >
                <PlusIcon
                  className="-ml-2 mr-1 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                <span>Add</span>
              </Button>
              <UploadCsvButton />
            </div>
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

        <CohortDetailsSidebar
          selectedCohort={selectedCohort as Cohort}
          onClose={() => setSelectedCohortId(null)}
        />
      </div>
    </ErrorBoundary>
  );
}
