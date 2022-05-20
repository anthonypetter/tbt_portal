import { gql } from "@apollo/client";
import { OrgDetailPageEngagementsQuery } from "@generated/graphql";
import { PlusIcon, SearchIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import { DateText } from "components/Date";
import { Input } from "components/Input";
import { useState } from "react";
import { EngagementsTable } from "./EngagementsTable";
import filter from "lodash/filter";
import { AssignmentRoleBadge } from "components/AssignmentRoleBadge";
import { Button } from "components/Button";
import { DetailsAside } from "components/DetailsAside";
import { AddEngagementModal } from "./AddNewEngagementModal";

EngagementsView.fragments = {
  engagementsList: gql`
    fragment EngagementsViewListF on Organization {
      engagements {
        id
        name
        startDate
        endDate
        organizationId
        cohorts {
          id
          name
          grade
          startDate
          endDate
        }
        staffAssignments {
          user {
            id
            fullName
            email
          }
          assignmentRole
        }
      }
    }
  `,
};

export type QueryEngagements = NonNullable<
  OrgDetailPageEngagementsQuery["organization"]
>["engagements"];

type Props = {
  organization: NonNullable<OrgDetailPageEngagementsQuery["organization"]>;
};

export function EngagementsView({ organization }: Props) {
  const [selectedEngagementId, setSelectedEngagementId] = useState<
    string | null
  >(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const filteredEngagements = searchTerm
    ? filter(organization.engagements, (e) =>
        e.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : organization.engagements;

  const selectedEngagement =
    filteredEngagements.find((e) => e.id === selectedEngagementId) ?? null;

  return (
    <>
      <div className="flex min-h-[500px]">
        <div className={clsx("flex-1 flex flex-col overflow-hidden")}>
          <div className="flex-1 flex items-stretch overflow-hidden">
            <main className="flex-1 overflow-y-auto">
              <div className="flex my-4 justify-between">
                <div className="flex-1 lg:max-w-sm lg:mr-2 lg:ml-1">
                  <Input
                    id="engagements-search"
                    type="search"
                    placeholder="Search"
                    leftIcon={SearchIcon}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  theme="tertiary"
                  className="mx-2"
                  onClick={() => setShowAddModal(true)}
                >
                  <PlusIcon
                    className="-ml-2 mr-1 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <span>Add</span>
                </Button>
              </div>

              <EngagementsTable
                engagements={filteredEngagements}
                onRowClick={(id) => setSelectedEngagementId(id)}
                selectedEngagement={selectedEngagement}
              />

              <AddEngagementModal
                organizationId={organization.id}
                show={showAddModal}
                onCancel={() => setShowAddModal(false)}
                onSuccess={() => setShowAddModal(false)}
              />
            </main>

            <DetailsSidebar
              selectedEngagement={selectedEngagement}
              onClose={() => setSelectedEngagementId(null)}
            />
          </div>
        </div>
      </div>
    </>
  );
}

type DetailsSidebarProps = {
  selectedEngagement: QueryEngagements[number] | null;
  onClose: () => void;
};

function DetailsSidebar({ selectedEngagement, onClose }: DetailsSidebarProps) {
  if (!selectedEngagement) {
    return <DetailsAside isOpen={false} onClose={onClose} />;
  }

  return (
    <DetailsAside
      title={selectedEngagement.name}
      isOpen={true}
      onClose={onClose}
    >
      <DetailsAside.Section title="Details">
        <DetailsAside.Line
          label="Starts"
          value={<DateText timeMs={selectedEngagement.startDate} />}
        />
        <DetailsAside.Line
          label="Ends"
          value={<DateText timeMs={selectedEngagement.endDate} />}
        />
      </DetailsAside.Section>

      <DetailsAside.Section title="Staff">
        {selectedEngagement.staffAssignments.length === 0 ? (
          <p className="py-2 text-sm font-medium text-gray-500 italic">
            Teachers not yet assigned.
          </p>
        ) : (
          selectedEngagement.staffAssignments.map((assignment) => (
            <DetailsAside.Line
              key={assignment.user.id}
              label={assignment.user.fullName}
              value={
                <AssignmentRoleBadge
                  assignmentRole={assignment.assignmentRole}
                />
              }
            />
          ))
        )}
      </DetailsAside.Section>

      <DetailsAside.Table
        title="Cohorts"
        rows={selectedEngagement.cohorts.map((c) => ({
          col1: c.name,
          col2: (
            <span>
              <DateText timeMs={c.startDate} />
              {" - "}
              <DateText timeMs={c.endDate} />
            </span>
          ),
        }))}
      />
    </DetailsAside>
  );
}
