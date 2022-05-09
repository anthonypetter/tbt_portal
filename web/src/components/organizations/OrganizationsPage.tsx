import { useState } from "react";
import { gql } from "@apollo/client";
import { Header } from "components/Header";
import { OrganizationsPageQuery } from "@generated/graphql";
import { Button } from "components/Button";
import { OrganizationsTable } from "./OrganizationsTable";
import { AddOrgModal } from "./AddOrgModal";
import { Breadcrumbs } from "components/Breadcrumbs";
import { Routes } from "@utils/routes";
import { HomeIcon } from "@heroicons/react/solid";

OrganizationsPage.fragments = {
  organizations: gql`
    fragment Organizations on Query {
      ...OrganizationsTable
    }
    ${OrganizationsTable.fragments.organizations}
  `,
};

type Props = {
  organizations: NonNullable<OrganizationsPageQuery["organizations"]>;
};

export function OrganizationsPage({ organizations }: Props) {
  const [showAddOrgModal, setShowAddOrgModal] = useState(false);

  return (
    <div>
      <Breadcrumbs
        path={[
          { name: "Home", href: Routes.home.href(), icon: HomeIcon },
          {
            name: "Organizations",
            href: Routes.organizations.href(),
            current: true,
          },
        ]}
      />
      <Header>Organizations</Header>

      <div className="flex justify-end mb-6">
        <Button onClick={() => setShowAddOrgModal(true)}>
          Add Organization
        </Button>
      </div>
      <div className="mb-4 lg:mb-0">
        <OrganizationsTable organizations={organizations} />
      </div>

      <AddOrgModal
        show={showAddOrgModal}
        onCancel={() => setShowAddOrgModal(false)}
        onSuccess={() => setShowAddOrgModal(false)}
      />
    </div>
  );
}
