import { gql } from "@apollo/client";
import {
  OrgDetailPageEngagementsQuery,
  OrgDetailPageCohortsQuery,
} from "@generated/graphql";
import { Breadcrumbs } from "components/Breadcrumbs";
import { Routes } from "@utils/routes";
import { HomeIcon } from "@heroicons/react/solid";
import { Button } from "components/Button";
import clsx from "clsx";
import { Container } from "components/Container";
import { EngagementsView } from "../engagements/EngagementsView";
import { getDisplayName, OrganizationTabs, Tab } from "./OrganizationTabs";
import { CohortsView } from "components/cohorts/CohortsView";
import { assertUnreachable } from "@utils/types";

OrganizationDetailPage.fragments = {
  engagementsView: gql`
    fragment EngagementsViewF on Organization {
      id
      name
      district
      subDistrict
      location
      description
      ...EngagementsViewListF
    }
    ${EngagementsView.fragments.engagementsList}
  `,
  cohortsView: gql`
    fragment CohortsViewF on Organization {
      id
      name
      district
      subDistrict
      location
      description
      ...CohortsViewListF
    }
    ${CohortsView.fragments.cohortsList}
  `,
};

export type TabOrganization =
  | {
      tab: Tab.Engagements;
      organization: NonNullable<OrgDetailPageEngagementsQuery["organization"]>;
    }
  | {
      tab: Tab.Cohorts;
      organization: NonNullable<OrgDetailPageCohortsQuery["organization"]>;
    };

type Props = {
  tabOrg: TabOrganization;
};

export function OrganizationDetailPage({ tabOrg }: Props) {
  return (
    <div>
      <Breadcrumbs
        path={[
          { name: "Home", href: Routes.home.href(), icon: HomeIcon },
          {
            name: "Organizations",
            href: Routes.organizations.href(),
          },
          {
            name: `${tabOrg.organization.name} ${getDisplayName(tabOrg.tab)}`,
            href: Routes.org.engagements.href(tabOrg.organization.id),
            current: true,
          },
        ]}
      />

      <Header
        title={tabOrg.organization.name}
        description={tabOrg.organization.description}
      />

      <div className="mt-8">
        <Container padding="md">
          <OrganizationTabs tabOrg={tabOrg} />
          <TabView tabOrg={tabOrg} />
        </Container>
      </div>
    </div>
  );
}

type TabViewProps = {
  tabOrg: TabOrganization;
};

function TabView({ tabOrg }: TabViewProps) {
  switch (tabOrg.tab) {
    case Tab.Engagements:
      return <EngagementsView organization={tabOrg.organization} />;

    case Tab.Cohorts:
      return <CohortsView organization={tabOrg.organization} />;

    default:
      assertUnreachable(tabOrg, "TabOrg.tab");
  }
}

type HeaderProps = {
  title: string;
  description?: string | null;
};

function Header({ title, description }: HeaderProps) {
  return (
    <div
      className={clsx(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between",
        "mb-8"
      )}
    >
      <div className="flex items-center">
        <div className="flex">
          <div>
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate mb-2">
              {title}
            </h1>

            {description && (
              <p className="text-sm font-medium text-gray-500">{description}</p>
            )}
          </div>
        </div>
      </div>
      <div className="sm:my-0 mt-4">
        <Button className="min-w-[80px]" onClick={() => console.log("edit")}>
          Edit
        </Button>
      </div>
    </div>
  );
}
