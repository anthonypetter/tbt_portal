import { useState } from "react";
import { DeleteModal } from "components/DeleteModal";
import React from "react";
import { gql, useMutation } from "@apollo/client";
import { DeleteOrganizationMutation } from "@generated/graphql";
import { triggerSuccessToast } from "components/Toast";
import { useResetOnShow } from "@utils/useResetOnShow";
import { GET_ORGANIZATIONS_QUERY_NAME } from "pages/organizations";

const DELETE_ORG = gql`
  mutation DeleteOrganization($id: ID!) {
    deleteOrganization(id: $id) {
      id
      name
      district
      subDistrict
    }
  }
`;

type Props = {
  show: boolean;
  organizationId?: string;
  orgName?: string;
  onDelete: () => void;
  onCancel: () => void;
};

export function DeleteOrganizationModal({
  show,
  organizationId,
  orgName: orgNameProp,
  onDelete,
  onCancel,
}: Props) {
  const [deleteOrg, { error, loading, reset }] =
    useMutation<DeleteOrganizationMutation>(DELETE_ORG, {
      refetchQueries: [GET_ORGANIZATIONS_QUERY_NAME],
      onQueryUpdated(observableQuery) {
        if (observableQuery.queryName === GET_ORGANIZATIONS_QUERY_NAME) {
          observableQuery.refetch();
        }
      },
    });

  const [orgName, setOrgName] = useState<string | undefined>(undefined);

  useResetOnShow(show, () => {
    reset();
    setOrgName(orgNameProp);
  });

  const message = orgName
    ? {
        message: `Are you sure you want to delete the organization named '${orgName}' ?`,
      }
    : {};

  return (
    <DeleteModal
      title={`Delete Organization`}
      deleting={loading}
      show={show}
      onCancel={onCancel}
      onDelete={async () => {
        if (organizationId) {
          await deleteOrg({ variables: { id: organizationId } });
          onDelete();
          triggerSuccessToast({ message: "Delete operation successful." });
        } else {
          console.error("Can't delete org without a valid organizationId.");
        }
      }}
      error={error instanceof Error ? error.message : undefined}
      {...message}
    />
  );
}
