import { useMemo, useState } from "react";
import { Routes } from "@utils/routes";
import { DateText } from "components/Date";
import { CONTEXT_MENU_ID, Table } from "components/Table";
import { Link } from "components/Link";
import { Column, Cell } from "react-table";
import { EditEngagementModal } from "./EditEngagementModal";
import { QueryEngagements } from "./EngagementsView";
import { ContextMenu } from "components/ContextMenu";
import { DeleteEngagementModal } from "./DeleteEngagementModal";

type Props = {
  engagements: QueryEngagements;
  onRowClick: (engagementId: string) => void;
  selectedEngagement: QueryEngagements[number] | null;
};

export function EngagementsTable({
  engagements,
  onRowClick,
  selectedEngagement,
}: Props) {
  const [engagementIdToEdit, setEngagementIdToEdit] = useState<string | null>(
    null
  );

  const [engagementIdToDelete, setEngagementIdToDelete] = useState<
    string | null
  >(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const contextMenu = useMemo(() => {
    return {
      onClickEdit(engagement: EngagementTableData) {
        setEngagementIdToEdit(engagement.id);
        setShowEditModal(true);
      },
      onClickDelete(engagement: EngagementTableData) {
        setEngagementIdToDelete(engagement.id);
        setShowDeleteModal(true);
      },
    };
  }, []);

  const { data, columns } = usePrepEngagementData(engagements, contextMenu);

  return (
    <div className="min-w-full">
      <Table
        columns={columns}
        data={data}
        border={false}
        onRowClick={(row) => onRowClick(row.original.id)}
        selectedId={selectedEngagement?.id}
      />

      <EditEngagementModal
        show={showEditModal}
        closeModal={() => setShowEditModal(false)}
        afterLeave={() => setEngagementIdToEdit(null)}
        engagement={
          engagementIdToEdit
            ? engagements.find((e) => e.id === engagementIdToEdit) ?? null
            : null
        }
      />

      <DeleteEngagementModal
        show={showDeleteModal}
        closeModal={() => setShowDeleteModal(false)}
        afterLeave={() => setEngagementIdToDelete(null)}
        engagement={
          engagementIdToDelete
            ? engagements.find((e) => e.id === engagementIdToDelete) ?? null
            : null
        }
      />
    </div>
  );
}

export type EngagementTableData = {
  id: string;
  name: string;
  startDate?: number | null;
  endDate?: number | null;
  organizationId: string;
};

function usePrepEngagementData(
  engagements: QueryEngagements,
  contextMenu: {
    onClickEdit: (engagement: EngagementTableData) => void;
    onClickDelete: (engagement: EngagementTableData) => void;
  }
): {
  data: EngagementTableData[];
  columns: Column<EngagementTableData>[];
} {
  const columns: Column<EngagementTableData>[] = useMemo(() => {
    return [
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ row }: Cell<EngagementTableData>) => {
          return (
            <Link
              href={Routes.engagement.cohorts.href(
                row.original.organizationId,
                row.original.id
              )}
            >
              {row.original.name}
            </Link>
          );
        },
      },
      {
        Header: "Starts",
        accessor: "startDate",
        Cell: ({ row }: Cell<EngagementTableData>) => {
          return <DateText timeMs={row.original.startDate} />;
        },
      },
      {
        Header: "Ends",
        accessor: "endDate",
        Cell: ({ row }: Cell<EngagementTableData>) => {
          return <DateText timeMs={row.original.endDate} />;
        },
      },
      {
        Header: () => null,
        accessor: "id",
        id: CONTEXT_MENU_ID,
        Cell: ({ row }: Cell<EngagementTableData>) => {
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

  //TODO: revisit this. Look into performance implications
  const stringifiedEngagements = JSON.stringify(engagements);

  const data = useMemo(() => {
    return engagements.map((engagement) => {
      return {
        id: engagement.id,
        name: engagement.name,
        startDate: engagement.startDate,
        endDate: engagement.endDate,
        organizationId: engagement.organizationId,
      };
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stringifiedEngagements]);

  return { data, columns };
}
