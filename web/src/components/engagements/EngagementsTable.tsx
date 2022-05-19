import { useMemo, useState } from "react";
import { Routes } from "@utils/routes";
import { DateText } from "components/Date";
import { Table } from "components/Table";
import Link from "next/link";
import { Column, Cell } from "react-table";
import { EditEngagementModal } from "./EditEngagementModal";
import { QueryEngagements } from "./EngagementsView";
import { fromJust } from "@utils/types";
import { EditIconButton } from "components/EditIconButton";

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
  const [engagementToEdit, setEngagementToEdit] =
    useState<EngagementTableData | null>(null);

  const contextMenu = useMemo(() => {
    return {
      onClickEdit(engagement: EngagementTableData) {
        setEngagementToEdit(engagement);
        setShowEditModal(true);
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
          engagementToEdit
            ? fromJust(
                engagements.find((e) => e.id === engagementToEdit.id),
                "engagementToEdit.id in engagements"
              )
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
              <EditIconButton
                onClick={() => contextMenu.onClickEdit(row.original)}
              />
            </div>
          );
        },
      },
    ];
  }, []);

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
