import { gql } from "@apollo/client";
import { CohortsPageQuery } from "@generated/graphql";
import { breadcrumbs } from "@utils/breadcrumbs";
import { Routes } from "@utils/routes";
import { PageHeader } from "components/PageHeader";
import { AllCohortsTable } from "./AllCohortsTable";

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
  return (
    <>
      <PageHeader
        title="Cohorts"
        breadcrumbs={[
          breadcrumbs.home(),
          { name: "Cohorts", href: Routes.cohorts.href(), current: true },
        ]}
      />
      <div className="mb-4 lg:mb-0">
        <AllCohortsTable cohorts={cohorts} />
      </div>
    </>
  );
}

export type QueryAllCohorts = NonNullable<CohortsPageQuery["cohorts"]>[number];
