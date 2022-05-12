import { gql } from "@apollo/client";
import { OrgDetailPageEngagementsQuery } from "@generated/graphql";
import { SearchIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import { DateText } from "components/Date";
import { Input } from "components/Input";
import { useState } from "react";
import { EngagementsTable } from "./EngagementsTable";
import filter from "lodash/filter";

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
      }
    }
  `,
};

type Props = {
  organization: NonNullable<OrgDetailPageEngagementsQuery["organization"]>;
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
        OrgDetailPageEngagementsQuery["organization"]
      >["engagements"][number]
    | null;
};

function DetailsSidebar({ selectedEngagement }: DetailsSidebarProps) {
  if (!selectedEngagement) {
    return (
      <aside
        className={clsx(
          "hidden lg:block",
          "p-8 overflow-y-auto w-72 xl:w-96",
          "bg-white border-l border-gray-200"
        )}
      >
        <div className="pb-16 space-y-6">
          Please select an engagement to see its details.
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={clsx(
        "hidden lg:block",
        "py-6 pl-6 overflow-y-auto w-72 xl:w-96",
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
        <DetailSection title="Details">
          <DetailLine label="Manager" value="Chamara Adams" />
          <DetailLine
            label="Starts"
            value={<DateText timeMs={selectedEngagement.startDate} />}
          />
          <DetailLine
            label="Starts"
            value={<DateText timeMs={selectedEngagement.endDate} />}
          />
          <DetailLine label="POC" value="N/A" />
        </DetailSection>

        {/* <DetailSection title="Staffing - Engagement-wide">
          Coming Soon
        </DetailSection> */}

        <DetailTable
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
      </div>
    </aside>
  );
}

type DetailSectionProps = {
  title: string;
  children: React.ReactNode;
};

function DetailSection({ title, children }: DetailSectionProps) {
  return (
    <div>
      <h3 className="font-medium text-gray-900">{title}</h3>
      <dl className="mt-2 border-t border-b border-gray-200 divide-y divide-gray-200">
        {children}
      </dl>
    </div>
  );
}

type DetailLineProps = {
  label?: string;
  value: React.ReactNode;
};

function DetailLine({ label, value }: DetailLineProps) {
  return (
    <div className="py-3 flex justify-between text-sm font-medium">
      <dt className="text-gray-500">{label}</dt>
      <dd className="text-gray-900">{value}</dd>
    </div>
  );
}

type DetailTableProps = {
  title: string;
  headers?: { col1: string; col2: string };
  rows: { col1: string; col2: React.ReactNode }[];
};

function DetailTable({ title, headers, rows }: DetailTableProps) {
  return (
    <div>
      <h3 className="font-medium text-gray-900 mb-3">{title}</h3>
      <div className="overflow-y-auto max-h-64">
        <table className="min-w-full divide-gray-200 divide-y border-t border-b border-gray-200">
          {headers && (
            <thead className="bg-gray-50">
              <th
                scope="col"
                className="px-1 py-3 text-left text-gray-500 text-xs font-medium tracking-wider uppercase"
              >
                {headers.col1}
              </th>
              <th
                scope="col"
                className="px-1 py-3 text-left text-gray-500 text-xs font-medium tracking-wider uppercase"
              >
                {headers.col2}
              </th>
            </thead>
          )}
          <tbody className="bg-white divide-gray-200 divide-y">
            {rows.map((r) => {
              return (
                <tr key={r.col1} className="hover:bg-gray-50">
                  <td className="py-4 text-gray-900 text-sm font-medium">
                    {r.col1}
                  </td>
                  <td className="py-4 text-gray-500 text-sm font-medium">
                    {r.col2}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
