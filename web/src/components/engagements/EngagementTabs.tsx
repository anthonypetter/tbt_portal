import { Routes } from "@utils/routes";
import { assertUnreachable } from "@utils/types";
import { EngagementCohortsView } from "components/cohorts/EngagementCohortsView";
import { LinkTabs } from "components/LinkTabs";
import { TabEngagement } from "./EngagementDetailPage";

export enum Tab {
  Cohorts,
  Sessions,
}

type Props = {
  tabEng: TabEngagement;
};

export function EngagementTabs({ tabEng }: Props) {
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
      name: getDisplayName(Tab.Sessions),
      href: Routes.org.cohorts.href(engagement.id),
      count: 0,
      current: tab === Tab.Sessions,
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

    //TODO: Repalce
    case Tab.Sessions:
      return <div>hello sessions</div>;

    default:
      assertUnreachable(tabEng, "tabEng.tab");
  }
}

export function getDisplayName(tab: Tab) {
  switch (tab) {
    case Tab.Cohorts:
      return "Cohorts";

    case Tab.Sessions:
      return "";

    default:
      assertUnreachable(tab, "tab");
  }
}
