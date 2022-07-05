import { gql } from "@apollo/client";
import { FlatCohortsTable_CohortFragment } from "@generated/graphql";
import { Routes } from "@utils/routes";
import { DeleteCohortModal } from "components/cohorts/DeleteCohortModal";
import { EditCohortModal } from "components/cohorts/EditCohortModal";
import { ContextMenu } from "components/ContextMenu";
import { Link } from "components/Link";
import { NormalizedDateText } from "components/NormalizedDateText";
import { CONTEXT_MENU_ID, Table } from "components/Table";
import { useMemo, useState } from "react";
import { Cell, Column } from "react-table";

const FlatCohortsPageQueryName = "FlatCohortsPage";

/**
 * Different versions of a cohort are needed by this component's children.
 * Since fragments merge repeated fields during composition, the final fragment will
 * represent the exact cohort needed by this component.
 */

FlatCohortsTable.fragments = {
  cohort: gql`
    fragment FlatCohortsTable_Cohort on Cohort {
      id
      name
      grade
      startDate
      endDate
      engagement {
        id
        name
        organization {
          id
          name
        }
      }
      ...EditCohortModal_Cohort
      ...DeleteCohortModal_Cohort
    }
    ${EditCohortModal.fragments.cohort}
    ${DeleteCohortModal.fragments.cohort}
  `,
};

type Props = {
  cohorts: FlatCohortsTable_CohortFragment[];
};

export function FlatCohortsTable({ cohorts }: Props) {
  const [cohortIdToEdit, setCohortIdToEdit] = useState<string | null>(null);
  const [cohortIdToDelete, setCohortIdToDelete] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const contextMenu = useMemo(() => {
    return {
      onClickDelete(cohort: CohortTableData) {
        setCohortIdToDelete(cohort.id);
        setShowDeleteModal(true);
      },
      onClickEdit(cohort: CohortTableData) {
        setCohortIdToEdit(cohort.id);
        setShowEditModal(true);
      },
    };
  }, []);

  const { columns, data: tableData } = usePrepCohortData(cohorts, contextMenu);

  return (
    <>
      <Table columns={columns} data={tableData} border={false} />
      <EditCohortModal
        show={showEditModal}
        closeModal={() => setShowEditModal(false)}
        afterLeave={() => setCohortIdToEdit(null)}
        cohort={
          cohortIdToEdit
            ? cohorts.find((e) => e.id === cohortIdToEdit) ?? null
            : null
        }
        refetchQueries={[FlatCohortsPageQueryName]}
      />

      <DeleteCohortModal
        show={showDeleteModal}
        closeModal={() => setShowDeleteModal(false)}
        cohort={
          cohortIdToDelete
            ? cohorts.find((e) => e.id === cohortIdToDelete) ?? null
            : null
        }
        afterLeave={() => setCohortIdToDelete(null)}
        refetchQueries={[FlatCohortsPageQueryName]}
      />
    </>
  );
}

export type CohortTableData = {
  id: string;
  name: string;
  grade?: string | null;
  startDate?: number | null;
  endDate?: number | null;
  organizationName?: string | null;
  organizationId?: string | null;
  engagementName?: string | null;
  engagementId?: string | null;
};

function usePrepCohortData(
  cohorts: FlatCohortsTable_CohortFragment[],
  contextMenu: {
    onClickEdit: (cohort: CohortTableData) => void;
    onClickDelete: (cohort: CohortTableData) => void;
  }
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
            <Link href={Routes.cohortDetail.href(row.original.id)}>
              {row.original.name}
            </Link>
          );
        },
      },
      {
        Header: "Organization",
        accessor: "organizationName",
        Cell: ({ row }: Cell<CohortTableData>) => {
          return (
            <Link
              href={Routes.org.details.href(`${row.original.organizationId}`)}
            >
              {row.original.organizationName}
            </Link>
          );
        },
      },
      {
        Header: "Engagement",
        accessor: "engagementName",
        Cell: ({ row }: Cell<CohortTableData>) => {
          return (
            <Link
              href={Routes.engagement.details.href(
                `${row.original.organizationId}`,
                `${row.original.engagementId}`
              )}
            >
              {row.original.engagementName}
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
          return <NormalizedDateText timeMs={row.original.startDate} />;
        },
      },
      {
        Header: "Ends",
        accessor: "endDate",
        Cell: ({ row }: Cell<CohortTableData>) => {
          return <NormalizedDateText timeMs={row.original.endDate} />;
        },
      },
      {
        Header: () => null,
        accessor: "id",
        id: CONTEXT_MENU_ID,
        Cell: ({ row }: Cell<CohortTableData>) => {
          return (
            <ContextMenu
              onClickEdit={() => contextMenu.onClickEdit(row.original)}
              onClickDelete={() => contextMenu.onClickDelete(row.original)}
            />
          );
        },
      },
    ];
  }, [contextMenu]);

  const stringfiedCohorts = JSON.stringify(cohorts);

  const data = useMemo(() => {
    return cohorts.map((cohort) => {
      return {
        id: cohort.id,
        name: cohort.name,
        grade: cohort.grade,
        startDate: cohort.startDate,
        endDate: cohort.endDate,
        organizationName: cohort?.engagement?.organization?.name,
        organizationId: cohort?.engagement?.organization?.id,
        engagementName: cohort?.engagement?.name,
        engagementId: cohort?.engagement.id,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stringfiedCohorts]);

  return { data, columns };
}
