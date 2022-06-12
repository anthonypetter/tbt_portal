import { gql } from "@apollo/client";
import { AllCohortsTableFragment, CohortsPageQuery } from "@generated/graphql";
import { ContextMenu } from "components/ContextMenu";
import { DateText } from "components/Date";
import { EditCohortModal } from "components/cohorts/EditCohortModal";
import { DeleteCohortModal } from "components/cohorts/DeleteCohortModal";
import { CONTEXT_MENU_ID, Table } from "components/Table";
import { useMemo, useState } from "react";
import { Cell, Column } from "react-table";

AllCohortsTable.fragments = {
  cohorts: gql`
    fragment AllCohortsTable on Query {
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
        engagementId
        staffAssignments {
          user {
            id
            fullName
            email
          }
          subject
        }
      }
    }
  `,
};

type Props = {
  onRowClick: (cohortId: string) => void;
  cohorts: NonNullable<CohortsPageQuery["cohorts"]>;
  selectedCohort: AllCohortsTableFragment["cohorts"][number] | null;
};

export function AllCohortsTable({
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
      <Table
        columns={columns}
        data={tableData}
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
    </>
  );
}

export type CohortTableData = {
  id: string;
  name: string;
  grade?: string | null;
  startDate?: number | null;
  endDate?: number | null;
  engagementId?: string | null;
};

function usePrepCohortData(
  cohorts: NonNullable<CohortsPageQuery["cohorts"]>,
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
          return <span className="font-semibold">{row.original.name}</span>;
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

  const stringfiedCohorts = JSON.stringify(cohorts);

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
  }, [stringfiedCohorts]);

  return { data, columns };
}
