import { gql } from "@apollo/client";
import { OrganizationEngagementsView_EngagementsViewFragment } from "@generated/graphql";
import { PlusIcon, SearchIcon } from "@heroicons/react/outline";
import { AssignmentRoleBadge } from "components/AssignmentRoleBadge";
import { Button } from "components/Button";
import { DetailsAside } from "components/DetailsAside";
import { ErrorBoundary } from "components/ErrorBoundary";
import { ErrorBox } from "components/ErrorBox";
import { Input } from "components/Input";
import { NormalizedDateText } from "components/NormalizedDateText";
import filter from "lodash/filter";
import { useState } from "react";
import { AddEngagementModal } from "./AddNewEngagementModal";
import { EngagementsTable } from "./EngagementsTable";

OrganizationEngagementsView.fragments = {
  engagements: gql`
    fragment OrganizationEngagementsView_EngagementsView on Organization {
      engagements {
        ...EngagementsTable_Engagement
      }
    }
    ${EngagementsTable.fragments.engagement}
  `,
};

type Props = {
  organizationId: string;
  engagements: OrganizationEngagementsView_EngagementsViewFragment["engagements"];
};

export function OrganizationEngagementsView({
  organizationId,
  engagements,
}: Props) {
  const [selectedEngagementId, setSelectedEngagementId] = useState<
    string | null
  >(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const filteredEngagements = searchTerm
    ? filter(engagements, (e) =>
        e.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : engagements;

  const selectedEngagement =
    filteredEngagements.find((e) => e.id === selectedEngagementId) ?? null;

  return (
    <ErrorBoundary fallbackRender={() => <ErrorBox className="mt-4" />}>
      <div className="flex min-h-full">
        <main className="flex-1">
          <div className="flex justify-between my-4">
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
            organizationId={organizationId}
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
    </ErrorBoundary>
  );
}

type DetailsSidebarProps = {
  selectedEngagement:
    | OrganizationEngagementsView_EngagementsViewFragment["engagements"][number]
    | null;
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
          value={<NormalizedDateText timeMs={selectedEngagement.startDate} />}
        />
        <DetailsAside.Line
          label="Ends"
          value={<NormalizedDateText timeMs={selectedEngagement.endDate} />}
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
              key={`${assignment.user.id}-${assignment.role}`}
              label={assignment.user.fullName}
              value={<AssignmentRoleBadge role={assignment.role} />}
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
              <NormalizedDateText timeMs={c.startDate} />
              {" - "}
              <NormalizedDateText timeMs={c.endDate} />
            </span>
          ),
        }))}
      />
    </DetailsAside>
  );
}
