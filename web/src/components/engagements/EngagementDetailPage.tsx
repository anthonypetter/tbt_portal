import { EngagementDetailPageQuery } from "@generated/graphql";
import { gql } from "@apollo/client";
import { PageHeader } from "components/PageHeader";
import { Routes } from "@utils/routes";
import { HomeIcon } from "@heroicons/react/solid";
import { getDisplayName, EngagementTabs, Tab } from "./EngagementTabs";
import { Container } from "components/Container";
import { EngagementCohortsView } from "components/cohorts/EngagementCohortsView";

EngagementDetailPage.fragments = {
  cohortsView: gql`
    fragment EngagementDetailPageCohorts on Engagement {
      id
      name
      startDate
      endDate
      staffAssignments {
        user {
          id
          fullName
          email
        }
        assignmentRole
      }
      organization {
        name
        id
      }
      ...EngagementCohortsView
    }
    ${EngagementCohortsView.fragments.cohortsList}
  `,
};

export type TabEngagement =
  | {
      tab: Tab.Cohorts;
      engagement: NonNullable<EngagementDetailPageQuery["engagement"]>;
    }
  | {
      tab: Tab.Sessions;
      engagement: NonNullable<EngagementDetailPageQuery["engagement"]>;
    };

type Props = {
  tabEng: TabEngagement;
};

export function EngagementDetailPage({ tabEng }: Props) {
  const { tab, engagement } = tabEng;
  return (
    <>
      <PageHeader
        title={tabEng.engagement.name}
        description="Engagement"
        breadcrumbs={[
          { name: "Home", href: Routes.home.href(), icon: HomeIcon },
          { name: "Organizations", href: Routes.organizations.href() },
          {
            name: `${engagement.organization.name} Engagements`,
            href: Routes.org.engagements.href(engagement.organization.id),
          },
          {
            name: `${engagement.name} ${getDisplayName(tab)}`,
            href: Routes.engagement.cohorts.href(
              engagement.organization.id,
              engagement.id
            ),
            current: true,
          },
        ]}
      />

      <div className="mt-8">
        <Container padding="md">
          <EngagementTabs tabEng={tabEng} />
        </Container>
      </div>
    </>
  );
}
