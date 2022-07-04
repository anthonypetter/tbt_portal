import { gql } from "@apollo/client";
import { OrganizationsTable_OrganizationFragment } from "@generated/graphql";
import { Routes } from "@utils/routes";
import { ContextMenu } from "components/ContextMenu";
import { Link } from "components/Link";
import { CONTEXT_MENU_ID, Table } from "components/Table";
import { useMemo, useState } from "react";
import { Cell, Column } from "react-table";
import { DeleteOrganizationModal } from "./DeleteOrganizationModal";
import { EditOrgModal } from "./EditOrgModal";

OrganizationsTable.fragments = {
  organization: gql`
    fragment OrganizationsTable_Organization on Organization {
      id
      name
      district
      subDistrict
      location
      description
      engagements {
        id
      }
    }
  `,
};

type Props = {
  organizations: OrganizationsTable_OrganizationFragment[];
};

export function OrganizationsTable({ organizations }: Props) {
  const [deleteModalOrg, setDeleteModaOrg] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [editModalOrg, setEditModalOrg] = useState<OrgTableData | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const contextMenu = useMemo(() => {
    return {
      onClickDelete(org: OrgTableData) {
        setDeleteModaOrg({ id: org.id, name: org.name });
        setShowDeleteModal(true);
      },
      onClickEdit(org: OrgTableData) {
        setEditModalOrg(org);
        setShowEditModal(true);
      },
    };
  }, []);

  const { columns, data: tableData } = usePrepOrgData(
    organizations,
    contextMenu
  );

  return (
    <>
      <Table columns={columns} data={tableData} />

      <DeleteOrganizationModal
        show={showDeleteModal}
        closeModal={() => setShowDeleteModal(false)}
        afterLeave={() => setDeleteModaOrg(null)}
        organization={
          deleteModalOrg
            ? organizations.find((o) => o.id === deleteModalOrg.id) ?? null
            : null
        }
      />

      <EditOrgModal
        show={showEditModal}
        closeModal={() => setShowEditModal(false)}
        afterLeave={() => setEditModalOrg(null)}
        organization={editModalOrg}
      />
    </>
  );
}

export type OrgTableData = {
  id: string;
  name: string;
  district?: string | null;
  subDistrict?: string | null;
  description?: string | null;
};

function usePrepOrgData(
  organizations: OrganizationsTable_OrganizationFragment[],
  contextMenu: {
    onClickEdit: (org: OrgTableData) => void;
    onClickDelete: (org: OrgTableData) => void;
  }
): {
  data: OrgTableData[];
  columns: Column<OrgTableData>[];
} {
  const columns: Column<OrgTableData>[] = useMemo(() => {
    return [
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ row }: Cell<OrgTableData>) => {
          return (
            <Link href={Routes.org.details.href(row.original.id)}>
              {row.original.name}
            </Link>
          );
        },
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "District",
        accessor: "district",
      },
      {
        Header: "Sub District",
        accessor: "subDistrict",
      },
      {
        Header: () => null,
        accessor: "id",
        id: CONTEXT_MENU_ID,
        Cell: ({ row }: Cell<OrgTableData>) => {
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

  const stringifiedOrgs = JSON.stringify(organizations);

  const data = useMemo(() => {
    return organizations.map((org) => {
      return {
        id: org.id,
        name: org.name,
        district: org.district,
        subDistrict: org.subDistrict,
        description: org.description,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stringifiedOrgs]);

  return { data, columns };
}
