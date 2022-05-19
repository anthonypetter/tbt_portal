import { useMemo, useState } from "react";
import { Column, Cell } from "react-table";
import { Table } from "components/Table";
import { gql } from "@apollo/client";
import { OrganizationsPageQuery } from "@generated/graphql";
import { ContextMenu } from "components/ContextMenu";
import { DeleteOrganizationModal } from "./DeleteOrganizationModal";
import { EditOrgModal } from "./EditOrgModal";
import Link from "next/link";
import { Routes } from "@utils/routes";

OrganizationsTable.fragments = {
  organizations: gql`
    fragment OrganizationsTable on Query {
      organizations {
        id
        name
        district
        subDistrict
        location
        description
      }
    }
  `,
};

type Props = {
  organizations: NonNullable<OrganizationsPageQuery["organizations"]>;
};

export function OrganizationsTable({ organizations }: Props) {
  const [deleteModalOrg, setDeleteModaOrg] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [editModalOrg, setEditModalOrg] = useState<OrgTableData | null>(null);

  const contextMenu = useMemo(() => {
    return {
      onClickDelete(org: OrgTableData) {
        setDeleteModaOrg({ id: org.id, name: org.name });
      },
      onClickEdit(org: OrgTableData) {
        setEditModalOrg(org);
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
        organizationId={deleteModalOrg?.id}
        orgName={deleteModalOrg?.name}
        show={deleteModalOrg !== null}
        onCancel={() => setDeleteModaOrg(null)}
        onDelete={() => setDeleteModaOrg(null)}
      />

      <EditOrgModal
        show={editModalOrg !== null}
        onCancel={() => setEditModalOrg(null)}
        onSuccess={() => setEditModalOrg(null)}
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
  organizations: NonNullable<OrganizationsPageQuery["organizations"]>,
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
            <Link href={Routes.org.engagements.href(row.original.id)}>
              <a className="font-medium text-gray-900">{row.original.name}</a>
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
        Cell: ({ row }: Cell<OrgTableData>) => {
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

  const stringifiedOrgs = JSON.stringify(organizations);

  const data = useMemo(() => {
    return organizations.map((org) => {
      return {
        id: org.id,
        name: org.name,
        district: org.district,
        description: org.description,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stringifiedOrgs]);

  return { data, columns };
}
