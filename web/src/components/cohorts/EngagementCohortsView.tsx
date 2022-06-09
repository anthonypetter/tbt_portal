import { gql } from "@apollo/client";
import { EngagementDetailsPageCohortsFragment } from "@generated/graphql";
import { PlusIcon, SearchIcon } from "@heroicons/react/outline";
import { Input } from "components/Input";
import { useState } from "react";
import { CohortsTable } from "./CohortsTable";
import filter from "lodash/filter";
import { Button } from "components/Button";
import { AddNewCohortModal } from "./AddNewCohortModal";
import { ErrorBox } from "components/ErrorBox";
import { ErrorBoundary } from "components/ErrorBoundary";
import { CohortDetailsSidebar } from "./CohortDetailsSidebar";

EngagementCohortsView.fragments = {
  cohortsList: gql`
    fragment EngagementCohortsView on Engagement {
      cohorts {
      ...CohortsForTable
      ...CohortForDetailsSidebar
      }
    }
    ${CohortsTable.fragments.cohortsForTable}
    ${CohortDetailsSidebar.fragments.cohortForDetailsSidebar}
  `,
};

type Props = {
  engagement: EngagementDetailsPageCohortsFragment;
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
          selectedCohort={selectedCohort}
          onClose={() => setSelectedCohortId(null)}
        />
      </div>
    </ErrorBoundary>
  );
}
