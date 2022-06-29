import { gql } from "@apollo/client";
import { FlatCohortsPage_CohortsFragment } from "@generated/graphql";
import { breadcrumbs } from "@utils/breadcrumbs";
import { Routes } from "@utils/routes";
import { PageHeader } from "components/PageHeader";
import { AllCohortsTable } from "./AllCohortsTable";

FlatCohortsPage.fragments = {
  cohorts: gql`
    fragment FlatCohortsPage_Cohorts on Query {
      ...AllCohortsTable_Cohorts
    }
    ${AllCohortsTable.fragments.cohorts}
  `,
};

type Props = {
  cohorts: NonNullable<FlatCohortsPage_CohortsFragment["cohorts"]>;
};

export function FlatCohortsPage({ cohorts }: Props) {
  return (
    <>
      <PageHeader
        title="Cohorts"
        breadcrumbs={[
          breadcrumbs.home(),
          { name: "Cohorts", href: Routes.cohorts.href(), current: true },
        ]}
      />
      <div className="mb-4 lg:mb-0 mt-8">
        <AllCohortsTable cohorts={cohorts} />
      </div>
    </>
  );
}

export type QueryAllCohorts = NonNullable<
  FlatCohortsPage_CohortsFragment["cohorts"]
>[number];
