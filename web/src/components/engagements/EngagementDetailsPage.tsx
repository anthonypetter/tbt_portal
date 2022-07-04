import { gql } from "@apollo/client";
import {
  EngagementDetailsPageCohortsFragment,
  EngagementDetailsPageCsvUploadFragment,
  EngagementDetailsPage_DetailsFragment,
} from "@generated/graphql";
import { PencilIcon } from "@heroicons/react/solid";
import { breadcrumbs } from "@utils/breadcrumbs";
import { Routes } from "@utils/routes";
import { Button } from "components/Button";
import { Container } from "components/Container";
import { NormalizedDateText } from "components/NormalizedDateText";
import { PageHeader } from "components/PageHeader";
import { useState } from "react";
import { EditEngagementModal } from "./EditEngagementModal";
import { EngagementDetailsTabs, Tab } from "./EngagementDetailsTabs";

const EngagementDetailsPageQueryName = "EngagementDetailsPage";

const THIS_COMPONENT = gql`
  fragment EngagementDetailsPage_Common on Engagement {
    id
    name
    startDate
    endDate
    organization {
      id
      name
    }
    ...EngagementForEditEngagementModal
  }
  ${EditEngagementModal.fragments.engagement}
`;

EngagementDetailsPage.fragments = {
  detailsView: gql`
    fragment EngagementDetailsPage_Details on Engagement {
      ...EngagementDetailsPage_Common
      ...EngagementDetailsTabs_Details
    }
    ${THIS_COMPONENT}
    ${EngagementDetailsTabs.fragments.detailsTab}
  `,
  cohortsView: gql`
    fragment EngagementDetailsPageCohorts on Engagement {
      ...EngagementDetailsPage_Common
      ...EngagementDetailsTabs_Cohorts
    }
    ${THIS_COMPONENT}
    ${EngagementDetailsTabs.fragments.cohortsTab}
  `,
  csvUploadView: gql`
    fragment EngagementDetailsPageCsvUpload on Engagement {
      ...EngagementDetailsPage_Common
      ...EngagementDetailsTabs_CsvUpload
    }
    ${THIS_COMPONENT}
    ${EngagementDetailsTabs.fragments.csvUploadTab}
  `,
};

type Props = {
  tabEng:
    | {
        tab: Tab.Details;
        engagement: EngagementDetailsPage_DetailsFragment;
      }
    | {
        tab: Tab.Cohorts;
        engagement: EngagementDetailsPageCohortsFragment;
      }
    | {
        tab: Tab.UploadCsv;
        engagement: EngagementDetailsPageCsvUploadFragment;
      };
};

export function EngagementDetailsPage({ tabEng }: Props) {
  const { engagement } = tabEng;
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <>
      <PageHeader
        title={engagement.name}
        breadcrumbs={[
          breadcrumbs.home(),
          breadcrumbs.organizations(),
          {
            name: engagement.organization.name,
            href: Routes.org.engagements.href(engagement.organization.id),
          },
          {
            name: engagement.name,
            href: Routes.engagement.cohorts.href(
              engagement.organization.id,
              engagement.id
            ),
            current: true,
          },
        ]}
      >
        <div className="flex justify-between items-center">
          <PageHeader.DescriptionText className="flex">
            <span className="mr-2">Engagement: </span>
            <DateRangeText
              startDateMs={engagement.startDate}
              endDateMs={engagement.endDate}
            />
          </PageHeader.DescriptionText>

          <div>
            <Button onClick={() => setShowEditModal(true)} theme="tertiary">
              <PencilIcon
                className="-ml-2 mr-2 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <span>Edit</span>
            </Button>
          </div>
        </div>
      </PageHeader>

      <div className="mt-8">
        <Container padding="md">
          <EngagementDetailsTabs tabEng={tabEng} />
        </Container>
      </div>

      <EditEngagementModal
        show={showEditModal}
        closeModal={() => setShowEditModal(false)}
        engagement={engagement}
        refetchQueries={[EngagementDetailsPageQueryName]}
      />
    </>
  );
}

function DateRangeText({
  startDateMs,
  endDateMs,
}: {
  startDateMs?: number;
  endDateMs?: number;
}) {
  return (
    <>
      {startDateMs ? (
        <NormalizedDateText timeMs={startDateMs} />
      ) : (
        "Start date unspecified"
      )}

      <span className="mx-3"> - </span>

      {endDateMs ? (
        <NormalizedDateText timeMs={endDateMs} />
      ) : (
        "End date unspecified"
      )}
    </>
  );
}
