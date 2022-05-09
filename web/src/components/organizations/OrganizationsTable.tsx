import { useMemo, useState } from "react";
import { Column, Cell } from "react-table";
import { Table } from "components/Table";
import { gql } from "@apollo/client";
import { OrganizationsPageQuery } from "@generated/graphql";
import { ContextMenu } from "components/ContextMenu";
import { DeleteOrganizationModal } from "./DeleteOrganizationModal";

OrganizationsTable.fragments = {
  organizations: gql`
    fragment OrganizationsTable on Query {
      organizations {
        id
        name
        district
        subDistrict
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

  const contextMenu = useMemo(() => {
    return {
      onClickDelete(id: string, name: string) {
        setDeleteModaOrg({ id, name });
      },
      onClickEdit(id: string) {
        // TODO
        console.log("EDIT!!!!!", id);
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
    </>
  );
}

type OrgTableData = {
  id: string;
  name: string;
  district?: string | null;
  subDistrict?: string | null;
};

function usePrepOrgData(
  organizations: NonNullable<OrganizationsPageQuery["organizations"]>,
  contextMenu: {
    onClickEdit: (id: string) => void;
    onClickDelete: (id: string, name: string) => void;
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
                onClickEdit={() => contextMenu.onClickEdit(row.values.id)}
                onClickDelete={() =>
                  contextMenu.onClickDelete(row.values.id, row.values.name)
                }
              />
            </div>
          );
        },
      },
    ];
  }, [contextMenu]);

  const orgIds = organizations.map((u) => u.id).join();

  const data = useMemo(() => {
    return organizations.map((org) => {
      return {
        id: org.id,
        name: org.name,
        district: org.district,
        subDistrict: org.subDistrict,
      };
    });
    // Used concatenated emails as a way to determine if users
    // dependency has changed. (instead of stringifying an array of objects)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgIds]);

  return { data, columns };
}
