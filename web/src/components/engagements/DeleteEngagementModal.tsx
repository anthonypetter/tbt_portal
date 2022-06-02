import React from "react";
import { gql, useMutation } from "@apollo/client";
import { DeleteEngagementMutation } from "@generated/graphql";
import { triggerSuccessToast } from "components/Toast";
import { OrgDetailPageEngagementsQueryName } from "./constants";
import { ExclamationIcon } from "@heroicons/react/outline";
import { Modal } from "components/Modal";
import { ErrorBox } from "components/ErrorBox";
import { Spinner } from "components/Spinner";
import { QueryEngagements } from "./OrganizationEngagementsView";
import { LoadingSkeleton } from "components/LoadingSkeleton";
import { FieldError } from "components/FieldError";
import pluralize from "pluralize";

const DELETE_ENGAGEMENT = gql`
  mutation DeleteEngagement($id: ID!) {
    deleteEngagement(id: $id) {
      id
      name
    }
  }
`;

type Props = {
  show: boolean;
  closeModal: () => void;
  afterLeave: () => void;
  engagement: QueryEngagements[number] | null;
};

export function DeleteEngagementModal({
  show,
  closeModal,
  engagement,
  afterLeave,
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
      title="Delete Engagement"
      afterLeave={afterLeave}
    >
      {engagement ? (
        <DeleteEngagementModalBody
          engagement={engagement}
          onCancel={closeModal}
          onSuccess={closeModal}
        />
      ) : (
        <LoadingSkeleton className="h-56" />
      )}
    </Modal>
  );
}

type DeleteEngagementModalBodyProps = {
  engagement: QueryEngagements[number];
  onCancel: () => void;
  onSuccess: () => void;
};

export function DeleteEngagementModalBody({
  engagement,
  onSuccess: onSuccessProp,
  onCancel,
}: DeleteEngagementModalBodyProps) {
  const { id, name, cohorts, staffAssignments } = engagement;

  const [deleteEngagement, { error, loading }] =
    useMutation<DeleteEngagementMutation>(DELETE_ENGAGEMENT, {
      refetchQueries: [OrgDetailPageEngagementsQueryName],
      onQueryUpdated(observableQuery) {
        observableQuery.refetch();
      },
    });

  const onDelete = async () => {
    await deleteEngagement({ variables: { id } });
    onSuccessProp();
    triggerSuccessToast({ message: "Delete operation successful." });
  };

  const cohortMsg =
    cohorts.length > 0
      ? `This engagement has ${pluralize(
          "cohort",
          cohorts.length,
          true
        )} assigned to it.`
      : undefined;

  const staffAssignmentMsg =
    staffAssignments.length > 0
      ? `This engagement has ${pluralize(
          "teacher",
          staffAssignments.length,
          true
        )} assigned to it.`
      : undefined;

  const deleteDisabled = staffAssignments.length > 0 || cohorts.length > 0;

  return (
    <div className="space-y-4 mt-4">
      <p className="text-gray-700 font-medium">Engagement: {name}</p>

      {cohortMsg && <FieldError msg={cohortMsg} />}
      {staffAssignmentMsg && <FieldError msg={staffAssignmentMsg} />}

      <p className="text-gray-700 text-sm">
        {deleteDisabled
          ? "You'll need to unassign teachers and delete cohorts manually to be able to delete this engagement. Sorry!"
          : "Are you sure you want to delete this engagement?"}
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
