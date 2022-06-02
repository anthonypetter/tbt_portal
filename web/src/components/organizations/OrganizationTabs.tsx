import { Routes } from "@utils/routes";
import { assertUnreachable } from "@utils/types";
import { OrganizationCohortsView } from "components/cohorts/OrganizationCohortsView";
import { OrganizationEngagementsView } from "components/engagements/OrganizationEngagementsView";
import { LinkTabs } from "components/LinkTabs";
import { TabOrganization } from "./OrganizationDetailPage";

export enum Tab {
  Engagements,
  Cohorts,
}

type Props = {
  tabOrg: TabOrganization;
};

export function OrganizationTabs({ tabOrg }: Props) {
  const { tab, organization } = tabOrg;
  const cohortCount = organization.engagements.flatMap((e) => e.cohorts).length;

  const tabsConfig = [
    {
      name: getDisplayName(Tab.Engagements),
      href: Routes.org.engagements.href(organization.id),
      count: organization.engagements.length,
      current: tab === Tab.Engagements,
    },
    {
      name: getDisplayName(Tab.Cohorts),
      href: Routes.org.cohorts.href(organization.id),
      count: cohortCount,
      current: tab === Tab.Cohorts,
    },
  ];
  return (
    <>
      <LinkTabs tabs={tabsConfig} />
      <TabView tabOrg={tabOrg} />
    </>
  );
}

type TabViewProps = {
  tabOrg: TabOrganization;
};

function TabView({ tabOrg }: TabViewProps) {
  switch (tabOrg.tab) {
    case Tab.Engagements:
      return <OrganizationEngagementsView organization={tabOrg.organization} />;

    case Tab.Cohorts:
      return <OrganizationCohortsView organization={tabOrg.organization} />;

    default:
      assertUnreachable(tabOrg, "TabOrg.tab");
  }
}

export function getDisplayName(tab: Tab) {
  switch (tab) {
    case Tab.Cohorts:
      return "Cohorts";

    case Tab.Engagements:
      return "Engagements";

    default:
      assertUnreachable(tab, "tab");
  }
}
