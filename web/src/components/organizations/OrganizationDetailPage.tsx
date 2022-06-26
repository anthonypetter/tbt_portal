import { gql } from "@apollo/client";
import {
  OrgDetailPageCohortsQuery,
  OrgDetailPageEngagementsQuery,
} from "@generated/graphql";
import { breadcrumbs } from "@utils/breadcrumbs";
import { Routes } from "@utils/routes";
import { OrganizationCohortsView } from "components/cohorts/OrganizationCohortsView";
import { Container } from "components/Container";
import { PageHeader } from "components/PageHeader";
import { OrganizationEngagementsView } from "../engagements/OrganizationEngagementsView";
import { OrganizationTabs, Tab } from "./OrganizationTabs";

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
            name: tabOrg.organization.name,
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
