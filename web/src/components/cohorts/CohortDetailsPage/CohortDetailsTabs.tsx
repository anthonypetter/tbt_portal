import { gql } from "@apollo/client";
import { CohortDetailsTabs_CohortFragment } from "@generated/graphql";
import { Routes } from "@utils/routes";
import { assertUnreachable } from "@utils/types";
import { LinkTabs } from "components/LinkTabs";
import { CohortDetailsView } from "./CohortDetailsView";

CohortDetailsTabs.fragments = {
  detailsTab: gql`
    fragment CohortDetailsTabs_Cohort on Cohort {
      id
      name
      startDate
      endDate
      staffAssignments {
        user {
          id
          fullName
          email
        }
        subject
      }
      ...CohortDetailsView_Cohort
    }
    ${CohortDetailsView.fragments.cohort}
  `,
};

export type TabCohort = {
  tab: Tab.Details;
  cohort: CohortDetailsTabs_CohortFragment;
};

export enum Tab {
  Details,
}

type Props = {
  tabCohort: TabCohort;
};

export function CohortDetailsTabs({ tabCohort }: Props) {
  const { tab } = tabCohort;

  const tabsConfig = [
    {
      name: getDisplayName(Tab.Details),
      href: Routes.cohortDetail.href(tabCohort.cohort.id),
      current: tab === Tab.Details,
    },
  ];

  return (
    <>
      <LinkTabs tabs={tabsConfig} />
      <TabView tabCohort={tabCohort} />
    </>
  );
}

type TabViewProps = {
  tabCohort: TabCohort;
};

function TabView({ tabCohort }: TabViewProps) {
  switch (tabCohort.tab) {
    case Tab.Details:
      return <CohortDetailsView cohort={tabCohort.cohort} />;

    default:
      assertUnreachable(tabCohort.tab, "tabCohort.tab");
  }
}

export function getDisplayName(tab: Tab) {
  switch (tab) {
    case Tab.Details:
      return "Details";

    default:
      assertUnreachable(tab, "tab");
  }
}
