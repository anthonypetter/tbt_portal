import { OrgDetailPageEngagementsQuery } from "@generated/graphql";
import { Routes } from "@utils/routes";
import { DateText } from "components/Date";
import { Table } from "components/Table";
import Link from "next/link";
import { useMemo } from "react";
import { Column, Cell } from "react-table";

type Props = {
  engagements: NonNullable<
    OrgDetailPageEngagementsQuery["organization"]
  >["engagements"];
  onRowClick: (engagementId: string) => void;
  selectedEngagement:
    | NonNullable<
        OrgDetailPageEngagementsQuery["organization"]
      >["engagements"][number]
    | null;
};

export function EngagementsTable({
  engagements,
  onRowClick,
  selectedEngagement,
}: Props) {
  const { data, columns } = usePrepEngagementData(engagements);

  return (
    <div className="min-w-full">
      <Table
        columns={columns}
        data={data}
        border={false}
        onRowClick={(row) => onRowClick(row.original.id)}
        selectedId={selectedEngagement?.id}
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
  >["engagements"]
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
          return <DateText timeMs={row.original.startDate} />;
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
