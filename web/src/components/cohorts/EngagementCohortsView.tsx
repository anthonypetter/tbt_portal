import { gql } from "@apollo/client";
import { EngagementCohortsViewFragment } from "@generated/graphql";
import { PlusIcon, SearchIcon } from "@heroicons/react/outline";
import { Button } from "components/Button";
import { ErrorBoundary } from "components/ErrorBoundary";
import { ErrorBox } from "components/ErrorBox";
import { Input } from "components/Input";
import filter from "lodash/filter";
import { useState } from "react";
import { AddNewCohortModal } from "./AddNewCohortModal";
import { CohortDetailsSidebar } from "./CohortDetailsSidebar";
import { CohortsTable } from "./CohortsTable";

const ENGAGEMENT_DETAILS_PAGE_QUERY_NAME = "EngagementDetailsPage";

EngagementCohortsView.fragments = {
  cohortsList: gql`
    fragment EngagementCohortsView on Engagement {
      cohorts {
        ...CohortsTable_Cohort
        ...CohortDetailsSidebar_Cohort
      }
      ...AddNewCohortModal_Engagement
    }
    ${CohortsTable.fragments.cohort}
    ${CohortDetailsSidebar.fragments.cohort}
    ${AddNewCohortModal.fragments.engagement}
  `,
};

type Props = {
  engagement: EngagementCohortsViewFragment;
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
          </div>

          <CohortsTable
            cohorts={filteredCohorts}
            onRowClick={(id) => setSelectedCohortId(id)}
            selectedCohort={selectedCohort}
          />

          <AddNewCohortModal
            engagement={engagement}
            show={showAddModal}
            onCancel={() => setShowAddModal(false)}
            onSuccess={() => setShowAddModal(false)}
            refetchQueries={[ENGAGEMENT_DETAILS_PAGE_QUERY_NAME]}
          />
        </main>

        <CohortDetailsSidebar
          selectedCohort={selectedCohort}
          onClose={() => setSelectedCohortId(null)}
        />
      </div>
    </ErrorBoundary>
  );
}
