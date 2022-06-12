import { Routes } from "@utils/routes";
import { assertUnreachable } from "@utils/types";
import { CsvUploadView } from "components/cohorts/csv-upload/CsvUploadView";
import { EngagementCohortsView } from "components/cohorts/EngagementCohortsView";
import { LinkTabs } from "components/LinkTabs";
import { TabEngagement } from "./EngagementDetailsPage";

export enum Tab {
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
    case Tab.Cohorts:
      return "Cohorts";

    case Tab.UploadCsv:
      return "Upload CSV";

    default:
      assertUnreachable(tab, "tab");
  }
}