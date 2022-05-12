import { OrgDetailPageCohortsQuery } from "@generated/graphql";
import { Routes } from "@utils/routes";
import { DateText } from "components/Date";
import { Table } from "components/Table";
import Link from "next/link";
import { useMemo } from "react";
import { Column, Cell } from "react-table";

type QueryCohorts = NonNullable<
  OrgDetailPageCohortsQuery["organization"]
>["engagements"][number]["cohorts"];

type Props = {
  organizationId: string;
  cohorts: QueryCohorts;
  onRowClick: (cohortId: string) => void;
  selectedCohort: QueryCohorts[number] | null;
};

export function CohortsTable({
  organizationId,
  cohorts,
  onRowClick,
  selectedCohort,
}: Props) {
  const { data, columns } = usePrepCohortData(organizationId, cohorts);

  return (
    <div className="min-w-full">
      <Table
        columns={columns}
        data={data}
        border={false}
        onRowClick={(row) => onRowClick(row.original.id)}
        selectedId={selectedCohort?.id}
      />
    </div>
  );
}

export type CohortTableData = {
  id: string;
  name: string;
  grade?: string | null;
  startDate?: number | null;
  endDate?: number | null;
};

function usePrepCohortData(
  organizationId: string,
  cohorts: QueryCohorts
): {
  data: CohortTableData[];
  columns: Column<CohortTableData>[];
} {
  const columns: Column<CohortTableData>[] = useMemo(() => {
    return [
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ row }: Cell<CohortTableData>) => {
          return (
            <Link
              href={Routes.org.engagementDetails.href(
                organizationId,
                row.original.id
              )}
            >
              <a className="font-medium text-gray-900">{row.original.name}</a>
            </Link>
          );
        },
      },
      {
        Header: "Grade",
        accessor: "grade",
      },
      {
        Header: "Starts",
        accessor: "startDate",
        Cell: ({ row }: Cell<CohortTableData>) => {
          return <DateText timeMs={row.original.startDate} />;
        },
      },
      {
        Header: "Ends",
        accessor: "endDate",
        Cell: ({ row }: Cell<CohortTableData>) => {
          return <DateText timeMs={row.original.startDate} />;
        },
      },
    ];
  }, []);

  const stringifiedCohorts = JSON.stringify(cohorts);

  const data = useMemo(() => {
    return cohorts.map((cohort) => {
      return {
        id: cohort.id,
        name: cohort.name,
        grade: cohort.grade,
        startDate: cohort.startDate,
        endDate: cohort.endDate,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stringifiedCohorts]);

  return { data, columns };
}
