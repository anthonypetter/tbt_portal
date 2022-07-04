import { gql } from "@apollo/client";
import { EngagementsTable_EngagementFragment } from "@generated/graphql";
import { Routes } from "@utils/routes";
import { ContextMenu } from "components/ContextMenu";
import { Link } from "components/Link";
import { NormalizedDateText } from "components/NormalizedDateText";
import { CONTEXT_MENU_ID, Table } from "components/Table";
import { useMemo, useState } from "react";
import { Cell, Column } from "react-table";
import { DeleteEngagementModal } from "./DeleteEngagementModal";
import { EditEngagementModal } from "./EditEngagementModal";

const OrgDetailPageEngagementsQueryName = "OrgDetailPageEngagements";

EngagementsTable.fragments = {
  engagement: gql`
    fragment EngagementsTable_Engagement on Engagement {
      id
      name
      startDate
      endDate
      organizationId
      cohorts {
        id
        name
        grade
        startDate
        endDate
      }
      staffAssignments {
        user {
          id
          fullName
          email
        }
        role
      }
      organization {
        id
      }
    }
  `,
};

type Props = {
  engagements: EngagementsTable_EngagementFragment[];
  onRowClick: (engagementId: string) => void;
  selectedEngagement: EngagementsTable_EngagementFragment | null;
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
        refetchQueries={[OrgDetailPageEngagementsQueryName]}
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
        refetchQueries={[OrgDetailPageEngagementsQueryName]}
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
  engagements: EngagementsTable_EngagementFragment[],
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
              href={Routes.engagement.details.href(
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
          return <NormalizedDateText timeMs={row.original.startDate} />;
        },
      },
      {
        Header: "Ends",
        accessor: "endDate",
        Cell: ({ row }: Cell<EngagementTableData>) => {
          return <NormalizedDateText timeMs={row.original.endDate} />;
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
