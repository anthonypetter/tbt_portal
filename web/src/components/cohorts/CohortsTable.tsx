import { useMemo, useState } from "react";
import { OrgDetailPageCohortsQuery } from "@generated/graphql";
import { Routes } from "@utils/routes";
import { DateText } from "components/Date";
import { EditIconButton } from "components/EditIconButton";
import { Table } from "components/Table";
import { Link } from "components/Link";
import { Column, Cell } from "react-table";
import { EditCohortModal } from "./EditCohortModal";
import { fromJust } from "@utils/types";

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
  const [editModalCohort, setEditModalCohort] =
    useState<CohortTableData | null>(null);

  const contextMenu = useMemo(() => {
    return {
      onClickEdit(cohort: CohortTableData) {
        setEditModalCohort(cohort);
      },
    };
  }, []);

  const { data, columns } = usePrepCohortData({
    organizationId,
    cohorts,
    contextMenu,
  });

  return (
    <div className="min-w-full">
      <Table
        columns={columns}
        data={data}
        border={false}
        onRowClick={(row) => onRowClick(row.original.id)}
        selectedId={selectedCohort?.id}
      />
      <EditCohortModal
        show={editModalCohort !== null}
        onCancel={() => setEditModalCohort(null)}
        onSuccess={() => setEditModalCohort(null)}
        cohort={
          editModalCohort
            ? fromJust(
                cohorts.find((e) => e.id === editModalCohort.id),
                "editModalCohort.id in cohorts"
              )
            : null
        }
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

function usePrepCohortData({
  organizationId,
  cohorts,
  contextMenu,
}: {
  organizationId: string;
  cohorts: QueryCohorts;
  contextMenu: {
    onClickEdit: (cohort: CohortTableData) => void;
  };
}): {
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
              {row.original.name}
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
      {
        Header: () => null,
        accessor: "id",
        Cell: ({ row }: Cell<CohortTableData>) => {
          return (
            <div className="flex justify-end">
              <EditIconButton
                onClick={() => contextMenu.onClickEdit(row.original)}
              />
            </div>
          );
        },
      },
    ];
  }, [organizationId, contextMenu]);

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
