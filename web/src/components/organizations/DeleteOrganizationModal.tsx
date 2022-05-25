import React from "react";
import { gql, useMutation } from "@apollo/client";
import {
  DeleteOrganizationMutation,
  OrganizationsPageQuery,
} from "@generated/graphql";
import { triggerSuccessToast } from "components/Toast";
import { GET_ORGANIZATIONS_QUERY_NAME } from "./constants";
import { Modal } from "components/Modal";
import { ExclamationIcon } from "@heroicons/react/outline";
import { FieldError } from "components/FieldError";
import pluralize from "pluralize";
import { ErrorBox } from "components/ErrorBox";
import { Spinner } from "components/Spinner";

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

type QueryOrganization = NonNullable<
  OrganizationsPageQuery["organizations"][number]
>;

type Props = {
  show: boolean;
  closeModal: () => void;
  afterLeave: () => void;
  organization: QueryOrganization | null;
};

export function DeleteOrganizationModal({
  show,
  closeModal,
  afterLeave,
  organization,
}: Props) {
  return (
    <Modal
      show={show}
      onClose={closeModal}
      icon={
        <Modal.Icon className="bg-red-100">
          <ExclamationIcon
            className="w-6 h-6 text-red-600"
            aria-hidden="true"
          />
        </Modal.Icon>
      }
      title="Delete Organization"
      afterLeave={afterLeave}
    >
      {organization && (
        <DeleteOrganizationModalBody
          organization={organization}
          onCancel={closeModal}
          onSuccess={closeModal}
        />
      )}
    </Modal>
  );
}

type DeleteOrganizationModalBodyProps = {
  organization: QueryOrganization;
  onSuccess: () => void;
  onCancel: () => void;
};

export function DeleteOrganizationModalBody({
  organization,
  onSuccess,
  onCancel,
}: DeleteOrganizationModalBodyProps) {
  const [deleteOrg, { error, loading }] =
    useMutation<DeleteOrganizationMutation>(DELETE_ORG, {
      refetchQueries: [GET_ORGANIZATIONS_QUERY_NAME],
      onQueryUpdated(observableQuery) {
        if (observableQuery.queryName === GET_ORGANIZATIONS_QUERY_NAME) {
          observableQuery.refetch();
        }
      },
    });

  const onDelete = async () => {
    await deleteOrg({ variables: { id: organization.id } });
    onSuccess();
    triggerSuccessToast({ message: "Delete operation successful." });
  };

  const engagementsMsg =
    organization.engagements.length > 0
      ? `This organization has ${pluralize(
          "engagement",
          organization.engagements.length,
          true
        )} assigned to it.`
      : undefined;

  const deleteDisabled = organization.engagements.length > 0;

  return (
    <div className="space-y-4 mt-4">
      <p className="text-gray-700 font-medium">
        Organization: {organization.name}
      </p>

      {engagementsMsg && <FieldError msg={engagementsMsg} />}

      <p className="text-gray-700 text-sm">
        {deleteDisabled
          ? "You'll need to remove engagements manually to be able to delete this organization. Sorry!"
          : "Are you sure you want to delete this organization?"}
      </p>

      {error && (
        <div className="mt-4">
          <ErrorBox />
        </div>
      )}
      <Modal.Buttons>
        <Modal.Button
          type="delete"
          onClick={onDelete}
          disabled={deleteDisabled}
        >
          {loading ? <Spinner /> : "Delete"}
        </Modal.Button>
        <Modal.Button type="cancel" onClick={onCancel}>
          Cancel
        </Modal.Button>
      </Modal.Buttons>
    </div>
  );
}
