import { useMemo, useState } from "react";
import { OrgDetailPageCohortsQuery } from "@generated/graphql";
import { Routes } from "@utils/routes";
import { DateText } from "components/Date";
import { Table } from "components/Table";
import { Link } from "components/Link";
import { Column, Cell } from "react-table";
import { EditCohortModal } from "./EditCohortModal";
import { ContextMenu } from "components/ContextMenu";
import { DeleteCohortModal } from "./DeleteCohortModal";

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
  const [cohortIdToEdit, setCohortIdToEdit] = useState<string | null>(null);
  const [cohortIdToDelete, setCohortIdToDelete] = useState<string | null>(null);

  const contextMenu = useMemo(() => {
    return {
      onClickEdit(cohort: CohortTableData) {
        setCohortIdToEdit(cohort.id);
      },
      onClickDelete(cohort: CohortTableData) {
        setCohortIdToDelete(cohort.id);
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
        afterLeave={() => setCohortIdToEdit(null)}
        cohort={
          cohortIdToEdit
            ? cohorts.find((e) => e.id === cohortIdToEdit) ?? null
            : null
        }
      />

      <DeleteCohortModal
        cohort={
          cohortIdToDelete
            ? cohorts.find((e) => e.id === cohortIdToDelete) ?? null
            : null
        }
        afterLeave={() => setCohortIdToDelete(null)}
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
    onClickDelete: (cohort: CohortTableData) => void;
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
              href={Routes.engagement.cohorts.href(
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
              <ContextMenu
                onClickEdit={() => contextMenu.onClickEdit(row.original)}
                onClickDelete={() => contextMenu.onClickDelete(row.original)}
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
