import { EngagementDetailPageQuery } from "@generated/graphql";
import { gql } from "@apollo/client";
import { PageHeader } from "components/PageHeader";
import { Routes } from "@utils/routes";
import { getDisplayName, EngagementTabs, Tab } from "./EngagementTabs";
import { Container } from "components/Container";
import { EngagementCohortsView } from "components/cohorts/EngagementCohortsView";
import { breadcrumbs } from "@utils/breadcrumbs";

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
        role
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
          breadcrumbs.home(),
          breadcrumbs.organizations(),
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
