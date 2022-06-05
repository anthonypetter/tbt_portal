import {
  EngagementDetailsPageCohortsFragment,
  EngagementDetailsPageCsvUploadFragment,
} from "@generated/graphql";
import { gql } from "@apollo/client";
import { PageHeader } from "components/PageHeader";
import { Routes } from "@utils/routes";
import {
  getDisplayName,
  EngagementDetailsTabs,
  Tab,
} from "./EngagementDetailsTabs";
import { Container } from "components/Container";
import { EngagementCohortsView } from "components/cohorts/EngagementCohortsView";
import { breadcrumbs } from "@utils/breadcrumbs";

EngagementDetailsPage.fragments = {
  cohortsView: gql`
    fragment EngagementDetailsPageCohorts on Engagement {
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
  csvUploadView: gql`
    fragment EngagementDetailsPageCsvUpload on Engagement {
      id
      name
      organization {
        id
        name
      }
      cohorts {
        id
      }
    }
  `,
};

export type TabEngagement =
  | {
      tab: Tab.Cohorts;
      engagement: EngagementDetailsPageCohortsFragment;
    }
  | {
      tab: Tab.UploadCsv;
      engagement: EngagementDetailsPageCsvUploadFragment;
    };

type Props = {
  tabEng: TabEngagement;
};

export function EngagementDetailsPage({ tabEng }: Props) {
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
          <EngagementDetailsTabs tabEng={tabEng} />
        </Container>
      </div>
    </>
  );
}