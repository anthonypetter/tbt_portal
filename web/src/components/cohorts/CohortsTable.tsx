import { useMemo, useState } from "react";
import { CohortForTableFragment } from "@generated/graphql";
import { DateText } from "components/Date";
import { CONTEXT_MENU_ID, Table } from "components/Table";
import { Column, Cell } from "react-table";
import { EditCohortModal } from "./EditCohortModal";
import { ContextMenu } from "components/ContextMenu";
import { DeleteCohortModal } from "./DeleteCohortModal";
import { gql } from "@apollo/client";

CohortsTable.fragments = {
  cohort: gql`
    fragment CohortForTable on Cohort {
      id
      createdAt
      name
      grade
      meetingRoom
      hostKey
      exempt
      startDate
      endDate
      engagementId
      engagement {
        id
        name
      }
      staffAssignments {
        user {
          id
          fullName
          email
        }
        subject
      }
    }
  `,
};

type Props = {
  organizationId: string;
  cohorts: CohortForTableFragment[];
  onRowClick: (cohortId: string) => void;
  selectedCohort: CohortForTableFragment | null;
};

export function CohortsTable({
  organizationId,
  cohorts,
  onRowClick,
  selectedCohort,
}: Props) {
  const [cohortIdToEdit, setCohortIdToEdit] = useState<string | null>(null);
  const [cohortIdToDelete, setCohortIdToDelete] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const contextMenu = useMemo(() => {
    return {
      onClickEdit(cohort: CohortTableData) {
        setCohortIdToEdit(cohort.id);
        setShowEditModal(true);
      },
      onClickDelete(cohort: CohortTableData) {
        setCohortIdToDelete(cohort.id);
        setShowDeleteModal(true);
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
        show={showEditModal}
        closeModal={() => setShowEditModal(false)}
        afterLeave={() => setCohortIdToEdit(null)}
        cohort={
          cohortIdToEdit
            ? cohorts.find((e) => e.id === cohortIdToEdit) ?? null
            : null
        }
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
  engagementId: string;
};

function usePrepCohortData({
  organizationId,
  cohorts,
  contextMenu,
}: {
  organizationId: string;
  cohorts: CohortForTableFragment[];
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
            <span className="font-semibold">{row.original.name}</span>
            // <Link
            //   href={Routes.cohort.href(
            //     organizationId,
            //     row.original.engagementId,
            //     row.original.id
            //   )}
            // >
            //   {row.original.name}
            // </Link>
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
          return <DateText timeMs={row.original.endDate} />;
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

  const stringifiedCohorts = JSON.stringify(cohorts);

  const data = useMemo(() => {
    return cohorts.map((cohort) => {
      return {
        id: cohort.id,
        name: cohort.name,
        grade: cohort.grade,
        startDate: cohort.startDate,
        endDate: cohort.endDate,
        engagementId: cohort.engagementId,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stringifiedCohorts]);

  return { data, columns };
}
