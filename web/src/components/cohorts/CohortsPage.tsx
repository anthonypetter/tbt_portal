import { gql } from "@apollo/client";
import { CohortsPageQuery } from "@generated/graphql";
import { HomeIcon, PlusIcon, SearchIcon } from "@heroicons/react/solid";
import { breadcrumbs } from "@utils/breadcrumbs";
import { getRoomUrl } from "@utils/roomUrls";
import { Routes } from "@utils/routes";
import clsx from "clsx";
import { AssignmentSubjectBadge } from "components/AssignmentSubjectBadge";
import { Button } from "components/Button";
import { Container } from "components/Container";
import { DateText } from "components/Date";
import { DetailsAside } from "components/DetailsAside";
import { ErrorBoundary } from "components/ErrorBoundary";
import { ErrorBox } from "components/ErrorBox";
import { Input } from "components/Input";
import { Link } from "components/Link";
import { PageHeader } from "components/PageHeader";
import { filter } from "lodash";
import { useState } from "react";
import { AllCohortsTable } from "./AllCohortsTable";

CohortsPage.fragments = {
  cohorts: gql`
    fragment Cohorts on Query {
      ...AllCohortsTable
    }
    ${AllCohortsTable.fragments.cohorts}
  `,
};

type Props = {
  cohorts: NonNullable<CohortsPageQuery["cohorts"]>;
};

export function CohortsPage({ cohorts }: Props) {
  const [selectedCohortId, setSelectedCohortId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const filteredCohorts = searchTerm
    ? filter(cohorts, (c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : cohorts;

  const selectedCohort =
    filteredCohorts.find((e) => e.id === selectedCohortId) ?? null;

  return (
    <ErrorBoundary fallbackRender={() => <ErrorBox className="mt-4" />}>
      <PageHeader
        title="All Cohorts"
        breadcrumbs={[
          breadcrumbs.home(),
          { name: "Cohorts", href: Routes.cohorts.href(), current: true },
        ]}
      />
      <div className="mt-8">
        <Container padding="md">
          <div className="flex min-h-full">
            <main className="flex-1">
              <div className="flex justify-between my-4">
                <div className="flex-1 lg:max-w-sm lg:mr-2 lg:ml-1">
                  <Input
                    id="cohorts-search"
                    type="search"
                    placeholder="Search"
                    leftIcon={SearchIcon}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* <Button
                  type="button"
                  theme="tertiary"
                  className="mx-2"
                  // onClick={() => setShowAddModal(true)}
                >
                  <PlusIcon
                    className="-ml-2 mr-1 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <span>Add</span>
                </Button> */}
              </div>

              <AllCohortsTable
                cohorts={filteredCohorts}
                onRowClick={(id) => setSelectedCohortId(id)}
                selectedCohort={null}
              />
            </main>

            <DetailsSidebar
              selectedCohort={selectedCohort}
              onClose={() => setSelectedCohortId(null)}
            />
          </div>
        </Container>
      </div>
    </ErrorBoundary>
  );
}

export type QueryAllCohorts = NonNullable<CohortsPageQuery["cohorts"]>[number];

type DetailsSidebarProps = {
  selectedCohort: QueryAllCohorts | null;
  onClose: () => void;
};

function DetailsSidebar({ selectedCohort, onClose }: DetailsSidebarProps) {
  if (!selectedCohort) {
    return <DetailsAside isOpen={false} onClose={onClose} />;
  }
  return (
    <DetailsAside isOpen={true} onClose={onClose} title={selectedCohort.name}>
      <DetailsAside.Section title="Details">
        <DetailsAside.Line
          label="Starts"
          value={<DateText timeMs={selectedCohort.startDate} />}
        />
        <DetailsAside.Line
          label="Ends"
          value={<DateText timeMs={selectedCohort.endDate} />}
        />
        <DetailsAside.Line label="Grade" value={selectedCohort.grade} />
        <DetailsAside.Line
          label="Meeting Room"
          value={
            selectedCohort.meetingRoom ? (
              <div>
                <Link href={selectedCohort.meetingRoom}>
                  <p className="text-ellipsis text-blue-400 truncate">
                    Backdoor Link
                  </p>
                </Link>

                <Link
                  href={
                    getRoomUrl(
                      Routes.cohortRoom.href(selectedCohort.meetingRoom)
                    ).host
                  }
                >
                  <p className="text-ellipsis text-blue-400 truncate">
                    Host Link
                  </p>
                </Link>
                <Link
                  href={
                    getRoomUrl(
                      Routes.cohortRoom.href(selectedCohort.meetingRoom)
                    ).student
                  }
                >
                  <p className="text-ellipsis text-blue-400 truncate">
                    Student Link
                  </p>
                </Link>
              </div>
            ) : (
              ""
            )
          }
        />
        <DetailsAside.Line label="Host key" value={selectedCohort.hostKey} />
        <DetailsAside.Line
          label="Created"
          value={<DateText timeMs={selectedCohort.createdAt} />}
        />
      </DetailsAside.Section>
      <DetailsAside.Section title="Staff">
        {selectedCohort.staffAssignments.length === 0 ? (
          <p className="py-2 text-sm font-medium text-gray-500 italic">
            Teachers not yet assigned.
          </p>
        ) : (
          selectedCohort.staffAssignments.map((assignment) => (
            <DetailsAside.Line
              key={`${assignment.user.id}-${assignment.subject}`}
              label={assignment.user.fullName}
              value={<AssignmentSubjectBadge subject={assignment.subject} />}
            />
          ))
        )}
      </DetailsAside.Section>
    </DetailsAside>
  );
}
