import { gql } from "@apollo/client";
import { CohortsPageQuery } from "@generated/graphql";
import {  SearchIcon } from "@heroicons/react/solid";
import { breadcrumbs } from "@utils/breadcrumbs";
import { Routes } from "@utils/routes";
import { Container } from "components/Container";
import { ErrorBoundary } from "components/ErrorBoundary";
import { ErrorBox } from "components/ErrorBox";
import { Input } from "components/Input";
import { PageHeader } from "components/PageHeader";
import { filter } from "lodash";
import { useState } from "react";
import { AllCohortsTable } from "./AllCohortsTable";
import { CohortDetailsSidebar } from "./CohortDetailsSidebar";

CohortsPage.fragments = {
  cohorts: gql`
    fragment Cohorts on Query {
      ...AllCohortsTable
    }
    ${AllCohortsTable.fragments.cohorts}
  `,
};

type Props = {
  cohorts: NonNullable<CohortsPageQuery["cohorts"]>;
};

export function CohortsPage({ cohorts }: Props) {
  const [selectedCohortId, setSelectedCohortId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const filteredCohorts = searchTerm
    ? filter(cohorts, (c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : cohorts;

  const selectedCohort =
    filteredCohorts.find((e) => e.id === selectedCohortId) ?? null;

  return (
    <ErrorBoundary fallbackRender={() => <ErrorBox className="mt-4" />}>
      <PageHeader
        title="All Cohorts"
        breadcrumbs={[
          breadcrumbs.home(),
          { name: "Cohorts", href: Routes.cohorts.href(), current: true },
        ]}
      />
      <div className="mt-8">
        <Container padding="md">
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

                {/* <Button
                  type="button"
                  theme="tertiary"
                  className="mx-2"
                  // onClick={() => setShowAddModal(true)}
                >
                  <PlusIcon
                    className="-ml-2 mr-1 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <span>Add</span>
                </Button> */}
              </div>

              <AllCohortsTable
                cohorts={filteredCohorts}
                onRowClick={(id) => setSelectedCohortId(id)}
                selectedCohort={null}
              />
            </main>

            <CohortDetailsSidebar
              selectedCohort={selectedCohort}
              onClose={() => setSelectedCohortId(null)}
            />
          </div>
        </Container>
      </div>
    </ErrorBoundary>
  );
}

export type QueryAllCohorts = NonNullable<CohortsPageQuery["cohorts"]>[number];
