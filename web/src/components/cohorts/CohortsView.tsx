import { gql } from "@apollo/client";
import { OrgDetailPageCohortsQuery } from "@generated/graphql";
import { SearchIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import { DateText } from "components/Date";
import { Input } from "components/Input";
import { useState } from "react";
import { CohortsTable } from "./CohortsTable";
import filter from "lodash/filter";

CohortsView.fragments = {
  cohortsList: gql`
    fragment CohortsViewListF on Organization {
      engagements {
        id
        name
        startDate
        endDate
        organizationId
        cohorts {
          id
          createdAt
          name
          grade
          meetingRoom
          hostKey
          exempt
          startDate
          endDate
        }
      }
    }
  `,
};

type Props = {
  organization: NonNullable<OrgDetailPageCohortsQuery["organization"]>;
};

export function CohortsView({ organization }: Props) {
  const [selectedCohortId, setSelectedCohortId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const cohorts = organization.engagements.flatMap((e) => e.cohorts);

  const filteredCohorts = searchTerm
    ? filter(cohorts, (c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : cohorts;

  const selectedCohort =
    filteredCohorts.find((e) => e.id === selectedCohortId) ?? null;

  return (
    <>
      <div className="flex min-h-full">
        <div className={clsx("flex-1 flex flex-col overflow-hidden")}>
          {/* Main content */}
          <div className="flex-1 flex items-stretch overflow-hidden">
            <main className="flex-1 overflow-y-auto">
              <div className="flex-1 my-4 lg:max-w-sm lg:mr-2">
                <Input
                  id="cohorts-search"
                  type="search"
                  placeholder="Search"
                  leftIcon={SearchIcon}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <CohortsTable
                organizationId={organization.id}
                cohorts={filteredCohorts}
                onRowClick={(id) => setSelectedCohortId(id)}
                selectedCohort={selectedCohort}
              />
            </main>

            {/* Details sidebar */}
            <DetailsSidebar selectedCohort={selectedCohort} />
          </div>
        </div>
      </div>
    </>
  );
}

type DetailsSidebarProps = {
  selectedCohort:
    | NonNullable<
        OrgDetailPageCohortsQuery["organization"]
      >["engagements"][number]["cohorts"][number]
    | null;
};

//TODO: extract sharable component
function DetailsSidebar({ selectedCohort }: DetailsSidebarProps) {
  if (!selectedCohort) {
    return (
      <aside
        className={clsx(
          "hidden lg:block",
          "p-8 overflow-y-auto w-80",
          "bg-white border-l border-gray-200"
        )}
      >
        <div className="pb-16 space-y-6">
          Please select a cohort to see its details.
        </div>
      </aside>
    );
  }
  return (
    <aside
      className={clsx(
        "hidden lg:block",
        "p-6 overflow-y-auto w-80",
        "bg-white border-l border-gray-200"
      )}
    >
      <div className="pb-16 space-y-6">
        <div>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                <span className="sr-only">Details for </span>
                {selectedCohort.name}
              </h2>
              {/* <p className="text-sm font-medium text-gray-500">Texas</p> */}
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-medium text-gray-900">Details</h3>
          <dl className="mt-2 border-t border-b border-gray-200 divide-y divide-gray-200">
            <div className="py-3 flex justify-between text-sm font-medium">
              <dt className="text-gray-500">Starts</dt>
              <dd className="text-gray-900">
                <DateText timeMs={selectedCohort.startDate} />
              </dd>
            </div>
            <div className="py-3 flex justify-between text-sm font-medium">
              <dt className="text-gray-500">Ends</dt>
              <dd className="text-gray-900">
                <DateText timeMs={selectedCohort.endDate} />
              </dd>
            </div>
            <div className="py-3 flex justify-between text-sm font-medium">
              <dt className="text-gray-500">Grade</dt>
              <dd className="text-gray-900">{selectedCohort.grade}</dd>
            </div>
            <div className="py-3 flex justify-between text-sm font-medium">
              <dt className="text-gray-500">Meeting Room</dt>
              <dd className="text-gray-900">{selectedCohort.meetingRoom}</dd>
            </div>
            <div className="py-3 flex justify-between text-sm font-medium">
              <dt className="text-gray-500">Exempt</dt>
              <dd className="text-gray-900">{selectedCohort.exempt}</dd>
            </div>
            <div className="py-3 flex justify-between text-sm font-medium">
              <dt className="text-gray-500">Exempt</dt>
              <dd className="text-gray-900">{selectedCohort.exempt}</dd>
            </div>
          </dl>
        </div>
        <div>
          <h3 className="font-medium text-gray-900">Staffing</h3>
          <p className="text-sm font-medium text-gray-500">Coming Soon..</p>
        </div>
      </div>
    </aside>
  );
}
