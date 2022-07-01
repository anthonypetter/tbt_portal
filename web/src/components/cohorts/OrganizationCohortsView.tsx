import { gql } from "@apollo/client";
import { OrganizationCohortsView_CohortsViewFragment } from "@generated/graphql";
import { SearchIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import { ErrorBoundary } from "components/ErrorBoundary";
import { ErrorBox } from "components/ErrorBox";
import { Input } from "components/Input";
import filter from "lodash/filter";
import { useState } from "react";
import { CohortDetailsSidebar } from "./CohortDetailsSidebar";
import { CohortsTable } from "./CohortsTable";

OrganizationCohortsView.fragments = {
  engagements: gql`
    fragment OrganizationCohortsView_CohortsView on Organization {
      engagements {
        id
        name
        startDate
        endDate
        organizationId
        cohorts {
          ...CohortDetailsSidebar_Cohort
          ...CohortsTable_Cohort
        }
      }
    }
    ${CohortDetailsSidebar.fragments.cohort}
    ${CohortsTable.fragments.cohort}
  `,
};

type Props = {
  engagements: OrganizationCohortsView_CohortsViewFragment["engagements"];
};

export function OrganizationCohortsView({ engagements }: Props) {
  const [selectedCohortId, setSelectedCohortId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const cohorts = engagements.flatMap((e) => e.cohorts);

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
                cohorts={filteredCohorts}
                onRowClick={(id) => setSelectedCohortId(id)}
                selectedCohort={selectedCohort}
              />
            </main>

            <CohortDetailsSidebar
              selectedCohort={selectedCohort}
              onClose={() => setSelectedCohortId(null)}
            />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
