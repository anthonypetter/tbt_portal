import { OrganizationDetailPageQuery } from "@generated/graphql";
import { SearchIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import { DateText } from "components/Date";
import { Input } from "components/Input";
import { useState } from "react";
import { EngagementsTable } from "./EngagementsTable";
import filter from "lodash/filter";

type Props = {
  organization: NonNullable<OrganizationDetailPageQuery["organization"]>;
};

export function EngagementsView({ organization }: Props) {
  const [selectedEngagementId, setSelectedEngagementId] = useState<
    string | null
  >(null);

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
      <div className="flex min-h-full">
        <div className={clsx("flex-1 flex flex-col overflow-hidden")}>
          {/* Main content */}
          <div className="flex-1 flex items-stretch overflow-hidden">
            <main className="flex-1 overflow-y-auto">
              <div className="flex-1 my-4 lg:max-w-sm lg:mr-2 lg:ml-1">
                <Input
                  id="engagements-search"
                  type="search"
                  placeholder="Search"
                  leftIcon={SearchIcon}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <EngagementsTable
                engagements={filteredEngagements}
                onRowClick={(id) => setSelectedEngagementId(id)}
                selectedEngagement={selectedEngagement}
              />
            </main>

            {/* Details sidebar */}
            <DetailsSidebar selectedEngagement={selectedEngagement} />
          </div>
        </div>
      </div>
    </>
  );
}

type DetailsSidebarProps = {
  selectedEngagement:
    | NonNullable<
        OrganizationDetailPageQuery["organization"]
      >["engagements"][number]
    | null;
};

function DetailsSidebar({ selectedEngagement }: DetailsSidebarProps) {
  if (!selectedEngagement) {
    return (
      <aside
        className={clsx(
          "hidden lg:block",
          "p-8 overflow-y-auto w-80",
          "bg-white border-l border-gray-200"
        )}
      >
        <div className="pb-16 space-y-6">
          Please select an engagement to see its Details.
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
                {selectedEngagement.name}
              </h2>
              <p className="text-sm font-medium text-gray-500">Texas</p>
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-medium text-gray-900">Details</h3>
          <dl className="mt-2 border-t border-b border-gray-200 divide-y divide-gray-200">
            <div className="py-3 flex justify-between text-sm font-medium">
              <dt className="text-gray-500">Manager</dt>
              <dd className="text-gray-900">Chamara Adams</dd>
            </div>
            <div className="py-3 flex justify-between text-sm font-medium">
              <dt className="text-gray-500">Starts</dt>
              <dd className="text-gray-900">
                <DateText timeMs={selectedEngagement.startDate} />
              </dd>
            </div>
            <div className="py-3 flex justify-between text-sm font-medium">
              <dt className="text-gray-500">Ends</dt>
              <dd className="text-gray-900">
                <DateText timeMs={selectedEngagement.endDate} />
              </dd>
            </div>
            <div className="py-3 flex justify-between text-sm font-medium">
              <dt className="text-gray-500">POC</dt>
              <dd className="text-gray-900">N/A</dd>
            </div>
          </dl>
        </div>
        <div>
          <h3 className="font-medium text-gray-900">Staffing</h3>
        </div>
      </div>
    </aside>
  );
}
