import { gql } from "@apollo/client";
import {
  OrgDetailPageEngagementsQuery,
  OrgDetailPageCohortsQuery,
} from "@generated/graphql";
import { Routes } from "@utils/routes";
import { HomeIcon } from "@heroicons/react/solid";
import { Container } from "components/Container";
import { EngagementsView } from "../engagements/EngagementsView";
import { getDisplayName, OrganizationTabs, Tab } from "./OrganizationTabs";
import { CohortsView } from "components/cohorts/CohortsView";
import { PageHeader } from "components/PageHeader";

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
    <>
      <PageHeader
        title={tabOrg.organization.name}
        description={tabOrg.organization.description}
        breadcrumbs={[
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

      <div className="mt-8">
        <Container padding="md">
          <OrganizationTabs tabOrg={tabOrg} />
        </Container>
      </div>
    </>
  );
}
