import { gql } from "@apollo/client";
import { FlatEngagementsTableEngagementFragment } from "@generated/graphql";
import { Routes } from "@utils/routes";
import { ContextMenu } from "components/ContextMenu";
import { Link } from "components/Link";
import { NormalizedDateText } from "components/NormalizedDateText";
import { CONTEXT_MENU_ID, Table } from "components/Table";
import { useMemo, useState } from "react";
import { Cell, Column } from "react-table";
import { DeleteEngagementModal } from "./DeleteEngagementModal";
import { EditEngagementModal } from "./EditEngagementModal";

type Props = {
  engagements: FlatEngagementsTableEngagementFragment[];
  selectedEngagement: FlatEngagementsTableEngagementFragment | null;
};

const FlatEngagementsPageQueryName = "FlatEngagementsPage";

/**
 * Different versions of an engagement are needed by this component's children.
 * Since fragments merge repeated fields during composition, the final fragment will
 * represent the exact engagement needed by this parent component.
 */
FlatEngagementsTable.fragments = {
  engagement: gql`
    fragment FlatEngagementsTableEngagement on Engagement {
      id
      name
      startDate
      endDate
      organization {
        id
        name
      }
      ...DeleteEngagementModalEngagement
      ...EngagementForEditEngagementModal
    }
    ${DeleteEngagementModal.fragments.engagement}
    ${EditEngagementModal.fragments.engagement}
  `,
};

export function FlatEngagementsTable({
  engagements,
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
        refetchQueries={[FlatEngagementsPageQueryName]}
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
        refetchQueries={[FlatEngagementsPageQueryName]}
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
  organizationName: string;
};

export function usePrepEngagementData(
  engagements: FlatEngagementsTableEngagementFragment[],
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
        Header: "Organization",
        accessor: "organizationName",
        Cell: ({ row }: Cell<EngagementTableData>) => {
          return (
            <Link
              href={Routes.org.engagements.href(row.original.organizationId)}
            >
              {row.original.organizationName}
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
        id: CONTEXT_MENU_ID,
        accessor: "id",
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
        organizationId: engagement.organization.id,
        organizationName: engagement.organization.name,
      };
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stringifiedEngagements]);

  return { data, columns };
}
