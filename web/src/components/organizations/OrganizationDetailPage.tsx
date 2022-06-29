import { gql } from "@apollo/client";
import { breadcrumbs } from "@utils/breadcrumbs";
import { Routes } from "@utils/routes";
import { Container } from "components/Container";
import { PageHeader } from "components/PageHeader";
import { OrganizationTabs, TabOrganization } from "./OrganizationTabs";

OrganizationDetailPage.fragments = {
  engagementsView: gql`
    fragment OrganizationDetailPage_Engagements on Organization {
      ...OrganizationTabs_Engagements
    }
    ${OrganizationTabs.fragments.engagementsTab}
  `,
  cohortsView: gql`
    fragment OrganizationDetailPage_Cohorts on Organization {
      ...OrganizationTabs_Cohorts
    }
    ${OrganizationTabs.fragments.cohortsTab}
  `,
};

type Props = {
  tabOrg: TabOrganization;
};

export function OrganizationDetailPage({ tabOrg }: Props) {
  return (
    <>
      <PageHeader
        title={tabOrg.organization.name}
        breadcrumbs={[
          breadcrumbs.home(),
          breadcrumbs.organizations(),
          {
            name: tabOrg.organization.name,
            href: Routes.org.engagements.href(tabOrg.organization.id),
            current: true,
          },
        ]}
      >
        <PageHeader.DescriptionText>
          Organization{" "}
          {tabOrg.organization.description
            ? `: ${tabOrg.organization.description}`
            : ""}
        </PageHeader.DescriptionText>
      </PageHeader>

      <div className="mt-8">
        <Container padding="md">
          <OrganizationTabs tabOrg={tabOrg} />
        </Container>
      </div>
    </>
  );
}
