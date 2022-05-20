import { useMemo, useState } from "react";
import { Routes } from "@utils/routes";
import { DateText } from "components/Date";
import { Table } from "components/Table";
import Link from "next/link";
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
  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  const [engagementIdToEdit, setEngagementIdToEdit] = useState<string | null>(
    null
  );

  const [engagementIdToDelete, setEngagementIdToDelete] = useState<
    string | null
  >(null);

  const contextMenu = useMemo(() => {
    return {
      onClickEdit(engagement: EngagementTableData) {
        setEngagementIdToEdit(engagement.id);
        setShowEditModal(true);
      },
      onClickDelete(engagement: EngagementTableData) {
        setEngagementIdToDelete(engagement.id);
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
        onCancel={() => setShowEditModal(false)}
        onSuccess={() => setShowEditModal(false)}
        engagement={
          engagementIdToEdit
            ? engagements.find((e) => e.id === engagementIdToEdit) ?? null
            : null
        }
      />

      <DeleteEngagementModal
        engagement={
          engagementIdToDelete
            ? engagements.find((e) => e.id === engagementIdToDelete) ?? null
            : null
        }
        afterLeave={() => setEngagementIdToDelete(null)}
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
              href={Routes.org.engagementDetails.href(
                row.original.organizationId,
                row.original.id
              )}
            >
              <a className="font-medium text-gray-900">{row.original.name}</a>
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
        Cell: ({ row }: Cell<EngagementTableData>) => {
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
