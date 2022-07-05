import { gql } from "@apollo/client";
import {
  OrganizationTabs_CohortsFragment,
  OrganizationTabs_DetailsFragment,
  OrganizationTabs_EngagementsFragment,
} from "@generated/graphql";
import { Routes } from "@utils/routes";
import { assertUnreachable } from "@utils/types";
import { OrganizationCohortsView } from "components/cohorts/OrganizationCohortsView";
import { OrganizationEngagementsView } from "components/engagements/OrganizationEngagementsView";
import { LinkTabs } from "components/LinkTabs";
import { OrganizationDetailsView } from "./OrganizationDetailsView";

OrganizationTabs.fragments = {
  detailsTab: gql`
    fragment OrganizationTabs_Details on Organization {
      id
      name
      engagements {
        id
        cohorts {
          id
        }
      }
      ...OrganizationDetailsView_Organization
    }
    ${OrganizationDetailsView.fragments.organization}
  `,
  engagementsTab: gql`
    fragment OrganizationTabs_Engagements on Organization {
      id
      name
      district
      subDistrict
      location
      description
      ...OrganizationEngagementsView_EngagementsView
    }
    ${OrganizationEngagementsView.fragments.engagements}
  `,
  cohortsTab: gql`
    fragment OrganizationTabs_Cohorts on Organization {
      id
      name
      district
      subDistrict
      location
      description
      ...OrganizationCohortsView_CohortsView
    }
    ${OrganizationCohortsView.fragments.engagements}
  `,
};

export type TabOrganization =
  | {
      tab: Tab.Details;
      organization: OrganizationTabs_DetailsFragment;
    }
  | {
      tab: Tab.Engagements;
      organization: OrganizationTabs_EngagementsFragment;
    }
  | {
      tab: Tab.Cohorts;
      organization: OrganizationTabs_CohortsFragment;
    };

export enum Tab {
  Details,
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
      name: getDisplayName(Tab.Details),
      href: Routes.org.details.href(organization.id),
      current: tab === Tab.Details,
    },
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
    case Tab.Details:
      return <OrganizationDetailsView organization={tabOrg.organization} />;

    case Tab.Engagements:
      return (
        <OrganizationEngagementsView
          organizationId={tabOrg.organization.id}
          engagements={tabOrg.organization.engagements}
        />
      );

    case Tab.Cohorts:
      return (
        <OrganizationCohortsView
          engagements={tabOrg.organization.engagements}
        />
      );

    default:
      assertUnreachable(tabOrg, "TabOrg.tab");
  }
}

export function getDisplayName(tab: Tab) {
  switch (tab) {
    case Tab.Details:
      return "Details";

    case Tab.Cohorts:
      return "Cohorts";

    case Tab.Engagements:
      return "Engagements";

    default:
      assertUnreachable(tab, "tab");
  }
}
