import React from "react";
import { gql, useMutation } from "@apollo/client";
import { DeleteCohortMutation } from "@generated/graphql";
import { triggerSuccessToast } from "components/Toast";
import { EngagementDetailPageQueryName } from "./constants";
import { ExclamationIcon } from "@heroicons/react/outline";
import { Modal } from "components/Modal";
import { ErrorBox } from "components/ErrorBox";
import { Spinner } from "components/Spinner";
import { QueryCohorts } from "./CohortsView";
import { LoadingSkeleton } from "components/LoadingSkeleton";
import { FieldError } from "components/FieldError";
import pluralize from "pluralize";

const DELETE_COHORT = gql`
  mutation DeleteCohort($id: ID!) {
    deleteCohort(id: $id) {
      id
      name
    }
  }
`;

type Props = {
  show: boolean;
  closeModal: () => void;
  cohort: QueryCohorts[number] | null;
  afterLeave: () => void;
};

export function DeleteCohortModal({
  show,
  closeModal,
  cohort,
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
      title="Delete Cohort"
      afterLeave={afterLeave}
    >
      {cohort ? (
        <DeleteCohortModalBody
          cohort={cohort}
          onCancel={closeModal}
          onSuccess={closeModal}
        />
      ) : (
        <LoadingSkeleton className="h-56" />
      )}
    </Modal>
  );
}

type DeleteCohortModalBodyProps = {
  cohort: QueryCohorts[number];
  onCancel: () => void;
  onSuccess: () => void;
};

export function DeleteCohortModalBody({
  cohort,
  onSuccess: onSuccessProp,
  onCancel,
}: DeleteCohortModalBodyProps) {
  const { id, name, staffAssignments } = cohort;

  const [deleteCohort, { error, loading }] = useMutation<DeleteCohortMutation>(
    DELETE_COHORT,
    {
      refetchQueries: [EngagementDetailPageQueryName],
      onQueryUpdated(observableQuery) {
        observableQuery.refetch();
      },
    }
  );

  const onDelete = async () => {
    await deleteCohort({ variables: { id } });
    onSuccessProp();
    triggerSuccessToast({ message: "Delete operation successful." });
  };

  const staffAssignmentMsg =
    staffAssignments.length > 0
      ? `This cohort has ${pluralize(
          "teacher",
          staffAssignments.length,
          true
        )} assigned to it.`
      : undefined;

  const deleteDisabled = staffAssignments.length > 0;

  return (
    <div className="space-y-4 mt-4">
      <p className="text-gray-700 font-medium">Cohort: {name}</p>

      {staffAssignmentMsg && <FieldError msg={staffAssignmentMsg} />}

      <p className="text-gray-700 text-sm">
        {deleteDisabled
          ? "You'll need to unassign teachers manually to be able to delete this cohort. Sorry!"
          : "Are you sure you want to delete this cohort?"}
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
