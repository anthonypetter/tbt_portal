import { gql } from "@apollo/client";
import { PencilIcon } from "@heroicons/react/solid";
import { breadcrumbs } from "@utils/breadcrumbs";
import { Routes } from "@utils/routes";
import { Button } from "components/Button";
import { Container } from "components/Container";
import { PageHeader } from "components/PageHeader";
import { StartEndDateRangeText } from "components/StartEndDateRangeText";
import { useState } from "react";
import { EditCohortModal } from "./../EditCohortModal";
import { CohortDetailsTabs, TabCohort } from "./CohortDetailsTabs";

const COHORT_DETAILS_PAGGE_QUERY_NAME = "CohortDetailsPage";

CohortDetailsPage.fragments = {
  cohort: gql`
    fragment CohortDetailsPageDetails_Cohort on Cohort {
      ...CohortDetailsTabs_Cohort
    }
    ${CohortDetailsTabs.fragments.detailsTab}
  `,
};

type Props = {
  tabCohort: TabCohort;
};

export function CohortDetailsPage({ tabCohort }: Props) {
  const { cohort } = tabCohort;
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <>
      <PageHeader
        title={cohort.name}
        breadcrumbs={[
          breadcrumbs.home(),
          { name: "Cohorts", href: Routes.cohorts.href() },
          {
            name: cohort.name,
            href: Routes.cohortDetail.href(cohort.id),
            current: true,
          },
        ]}
      >
        <div className="flex justify-between items-center">
          <PageHeader.DescriptionText className="flex">
            <span className="mr-2">Cohort: </span>
            <StartEndDateRangeText
              startDateMs={cohort.startDate}
              endDateMs={cohort.endDate}
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
          <CohortDetailsTabs tabCohort={tabCohort} />
        </Container>
      </div>

      <EditCohortModal
        show={showEditModal}
        closeModal={() => setShowEditModal(false)}
        cohort={cohort}
        refetchQueries={[COHORT_DETAILS_PAGGE_QUERY_NAME]}
      />
    </>
  );
}
