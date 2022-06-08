import { gql } from "@apollo/client";
import {
  OrgDetailPageEngagementsQuery,
  OrgDetailPageCohortsQuery,
} from "@generated/graphql";
import { Routes } from "@utils/routes";
import { Container } from "components/Container";
import { OrganizationEngagementsView } from "../engagements/OrganizationEngagementsView";
import { OrganizationCohortsView } from "components/cohorts/OrganizationCohortsView";
import { getDisplayName, OrganizationTabs, Tab } from "./OrganizationTabs";
import { PageHeader } from "components/PageHeader";
import { breadcrumbs } from "@utils/breadcrumbs";

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
    ${OrganizationEngagementsView.fragments.engagementsList}
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
    ${OrganizationCohortsView.fragments.cohortsList}
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
        description={`Organization${
          tabOrg.organization.description
            ? `: ${tabOrg.organization.description}`
            : ""
        }`}
        breadcrumbs={[
          breadcrumbs.home(),
          breadcrumbs.organizations(),
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
