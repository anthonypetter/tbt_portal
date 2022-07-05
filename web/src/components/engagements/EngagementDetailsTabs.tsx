import { gql } from "@apollo/client";
import {
  EngagementDetailsTabs_CohortsFragment,
  EngagementDetailsTabs_CsvUploadFragment,
  EngagementDetailsTabs_DetailsFragment,
} from "@generated/graphql";
import { Routes } from "@utils/routes";
import { assertUnreachable } from "@utils/types";
import { CsvUploadView } from "components/cohorts/csv-upload/CsvUploadView";
import { EngagementCohortsView } from "components/cohorts/EngagementCohortsView";
import { LinkTabs } from "components/LinkTabs";
import { EngagementDetailsView } from "./EngagementDetailsView";

const THIS_COMPONENT = gql`
  fragment EngagementDetailsTabs_Common on Engagement {
    id
    organization {
      id
    }
    cohorts {
      id
    }
  }
`;

EngagementDetailsTabs.fragments = {
  detailsTab: gql`
    fragment EngagementDetailsTabs_Details on Engagement {
      ...EngagementDetailsTabs_Common
      ...EngagementDetailsView_Engagement
    }
    ${THIS_COMPONENT}
    ${EngagementDetailsView.fragments.engagement}
  `,

  cohortsTab: gql`
    fragment EngagementDetailsTabs_Cohorts on Engagement {
      ...EngagementDetailsTabs_Common
      ...EngagementCohortsView
    }
    ${THIS_COMPONENT}
    ${EngagementCohortsView.fragments.cohortsList}
  `,

  csvUploadTab: gql`
    fragment EngagementDetailsTabs_CsvUpload on Engagement {
      ...EngagementDetailsTabs_Common
      ...CsvUploadView_Engagement
    }
    ${THIS_COMPONENT}
    ${CsvUploadView.fragments.engagement}
  `,
};

type TabEngagement =
  | {
      tab: Tab.Details;
      engagement: EngagementDetailsTabs_DetailsFragment;
    }
  | {
      tab: Tab.Cohorts;
      engagement: EngagementDetailsTabs_CohortsFragment;
    }
  | {
      tab: Tab.UploadCsv;
      engagement: EngagementDetailsTabs_CsvUploadFragment;
    };

export enum Tab {
  Details,
  Cohorts,
  UploadCsv,
}

type Props = {
  tabEng: TabEngagement;
};

export function EngagementDetailsTabs({ tabEng }: Props) {
  const { tab, engagement } = tabEng;

  const tabsConfig = [
    {
      name: getDisplayName(Tab.Details),
      href: Routes.engagement.details.href(
        engagement.organization.id,
        engagement.id
      ),
      current: tab === Tab.Details,
    },
    {
      name: getDisplayName(Tab.Cohorts),
      href: Routes.engagement.cohorts.href(
        engagement.organization.id,
        engagement.id
      ),
      count: engagement.cohorts.length,
      current: tab === Tab.Cohorts,
    },
    {
      name: getDisplayName(Tab.UploadCsv),
      href: Routes.engagement.uploadCsv.href(
        engagement.organization.id,
        engagement.id
      ),
      current: tab === Tab.UploadCsv,
    },
  ];

  return (
    <>
      <LinkTabs tabs={tabsConfig} />
      <TabView tabEng={tabEng} />
    </>
  );
}

type TabViewProps = {
  tabEng: TabEngagement;
};

function TabView({ tabEng }: TabViewProps) {
  switch (tabEng.tab) {
    case Tab.Details:
      return <EngagementDetailsView engagement={tabEng.engagement} />;

    case Tab.Cohorts:
      return <EngagementCohortsView engagement={tabEng.engagement} />;

    case Tab.UploadCsv:
      return <CsvUploadView engagement={tabEng.engagement} />;

    default:
      assertUnreachable(tabEng, "tabEng.tab");
  }
}

export function getDisplayName(tab: Tab) {
  switch (tab) {
    case Tab.Details:
      return "Details";

    case Tab.Cohorts:
      return "Cohorts";

    case Tab.UploadCsv:
      return "Upload CSV";

    default:
      assertUnreachable(tab, "tab");
  }
}
