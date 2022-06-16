import { gql, useMutation } from "@apollo/client";
import {
  CohortForTableFragment,
  DeleteCohortMutation,
} from "@generated/graphql";
import { ExclamationIcon } from "@heroicons/react/outline";
import { ErrorBox } from "components/ErrorBox";
import { FieldError } from "components/FieldError";
import { LoadingSkeleton } from "components/LoadingSkeleton";
import { Modal } from "components/Modal";
import { Spinner } from "components/Spinner";
import { triggerSuccessToast } from "components/Toast";
import pluralize from "pluralize";
import React from "react";
import {
  ENGAGEMENT_DETAILS_PAGE_QUERY_NAME,
  ORG_DETAIL_PAGE_COHORTS_NAME,
} from "./constants";

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
  cohort: CohortForTableFragment | null;
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
  cohort: CohortForTableFragment;
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
      refetchQueries: [
        ORG_DETAIL_PAGE_COHORTS_NAME,
        ENGAGEMENT_DETAILS_PAGE_QUERY_NAME,
      ],
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
