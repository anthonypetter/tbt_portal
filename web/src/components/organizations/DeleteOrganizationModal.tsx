import { useState, useEffect, useMemo, useRef } from "react";
import { DeleteModal } from "components/DeleteModal";
import React from "react";
import { gql } from "@apollo/client";
import { useDeleteOrganizationMutation } from "@generated/graphql";
import { triggerErrorToast, triggerSuccessToast } from "components/Toast";
import { useResetOnShow } from "@utils/useResetOnShow";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DELETE_ORG = gql`
  mutation DeleteOrganization($id: ID!) {
    deleteOrganization(id: $id) {
      id
    }
  }
`;

type Props = {
  show: boolean;
  organizationId?: string;
  orgName?: string;
  onDelete: (id: string) => void;
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
    useDeleteOrganizationMutation();
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
          onDelete(organizationId);
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
