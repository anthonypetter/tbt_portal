import { useMemo, useState } from "react";
import { OrgDetailPageEngagementsQuery } from "@generated/graphql";
import { PencilIcon } from "@heroicons/react/solid";
import { Routes } from "@utils/routes";
import clsx from "clsx";
import { DateText } from "components/Date";
import { Table } from "components/Table";
import Link from "next/link";
import { Column, Cell } from "react-table";
import { EditEngagementModal } from "./EditEngagementModal";
import { QueryEngagements } from "./EngagementsView";
import { fromJust } from "@utils/types";

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
  const [editModalEngagement, setEditModalEngagement] =
    useState<EngagementTableData | null>(null);

  const contextMenu = useMemo(() => {
    return {
      onClickEdit(engagement: EngagementTableData) {
        setEditModalEngagement(engagement);
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
        show={editModalEngagement !== null}
        onCancel={() => setEditModalEngagement(null)}
        onSuccess={() => setEditModalEngagement(null)}
        engagement={
          editModalEngagement
            ? fromJust(
                engagements.find((e) => e.id === editModalEngagement.id),
                "editModalEngagement.id in engagements"
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
  engagements: NonNullable<
    OrgDetailPageEngagementsQuery["organization"]
  >["engagements"],

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

function EditIconButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className={clsx(
        "inline-flex items-center rounded-md",
        "text-sm font-medium text-gray-700",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-blue-500"
      )}
      onClick={onClick}
    >
      <PencilIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
    </button>
  );
}
