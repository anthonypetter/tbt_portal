import { OrganizationDetailPageQuery } from "@generated/graphql";
import { Routes } from "@utils/routes";
import { LinkTabs } from "components/LinkTabs";
import { useRouter } from "next/router";

export enum Tab {
  Engagements,
  Cohorts,
}

const ENGAGEMENT_TAB = {
  tab: Tab.Engagements,
  displayName: "Engagements",
};

const COHORT_TAB = {
  tab: Tab.Cohorts,
  displayName: "Cohorts",
};

type Props = {
  organization: NonNullable<OrganizationDetailPageQuery["organization"]>;
};

export function OrganizationTabs({ organization }: Props) {
  const { pathname } = useRouter();

  const { tab: currentTab } = identifyTab(pathname);

  const tabsConfig = [
    {
      name: ENGAGEMENT_TAB.displayName,
      href: Routes.org.engagements.href(organization.id),
      count: organization.engagements.length,
      current: currentTab === Tab.Engagements,
    },
    {
      name: COHORT_TAB.displayName,
      href: Routes.org.cohorts.href(organization.id),
      count: 36, //TODO: fix
      current: currentTab === Tab.Cohorts,
    },
  ];
  return <LinkTabs tabs={tabsConfig} />;
}

export function identifyTab(pathname: string): {
  tab: Tab;
  displayName: string;
} {
  switch (pathname) {
    case Routes.org.engagements.path():
      return ENGAGEMENT_TAB;

    case Routes.org.cohorts.path():
      return COHORT_TAB;

    default:
      return ENGAGEMENT_TAB;
  }
}
