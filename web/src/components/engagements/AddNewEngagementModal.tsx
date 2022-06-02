import { useRef, useState } from "react";
import { Spinner } from "../Spinner";
import { Modal } from "../Modal";
import { ErrorBox } from "components/ErrorBox";
import { ApolloError, gql, useMutation } from "@apollo/client";
import { AddEngagementMutation } from "@generated/graphql";
import { fromJust } from "@utils/types";
import { Input } from "components/Input";
import { MdWorkspacesOutline } from "react-icons/md";
import noop from "lodash/noop";
import DatePicker from "react-datepicker";
import {
  AssignEngagementTeachers,
  EngagementStaffTeacher,
} from "../staffAssignments/AssignEngagementTeachers";

const REFETCH_QUERIES = ["OrgDetailPageEngagements"];

const ADD_ENGAGEMENT = gql`
  mutation AddEngagement($input: AddEngagementInput!) {
    addEngagement(input: $input) {
      id
      name
    }
  }
`;

type Props = {
  organizationId: string;
  show: boolean;
  onCancel: () => void;
  onSuccess: () => void;
};

export function AddEngagementModal({
  show,
  organizationId,
  onCancel,
  onSuccess,
}: Props) {
  return (
    <Modal
      show={show}
      onClose={noop}
      icon={
        <Modal.Icon className="bg-green-100">
          <MdWorkspacesOutline
            className="w-6 h-6 text-green-600"
            aria-hidden="true"
          />
        </Modal.Icon>
      }
      title="Add engagement"
      width="large"
    >
      <AddEngagementModalBody
        organizationId={organizationId}
        onCancel={onCancel}
        onSuccess={onSuccess}
      />
    </Modal>
  );
}

type AddEngagementModalBodyProps = {
  organizationId: string;
  onCancel: () => void;
  onSuccess: () => void;
};

export function AddEngagementModalBody({
  organizationId,
  onCancel,
  onSuccess,
}: AddEngagementModalBodyProps) {
  const cancelButtonRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [name, setName] = useState<string | null | undefined>();
  const [startDate, setStartDate] = useState<Date | null | undefined>();
  const [endDate, setEndDate] = useState<Date | null | undefined>();
  const [staff, setStaff] = useState<EngagementStaffTeacher[]>([]);

  const [addEngagement, { loading }] = useMutation<AddEngagementMutation>(
    ADD_ENGAGEMENT,
    {
      onError: (err: ApolloError) => setErrorMsg(err.message),
      onCompleted: onSuccess,
    }
  );

  const onAddEngagement = async () => {
    await addEngagement({
      variables: {
        input: {
          name: fromJust(name, "name"),
          organizationId,
          startDate: startDate ? startDate.getTime() : startDate,
          endDate: endDate ? endDate.getTime() : endDate,
          newStaffAssignments: staff.map((t) => ({
            userId: t.userId,
            role: t.role,
          })),
        },
      },
      refetchQueries: REFETCH_QUERIES,
      onQueryUpdated(observableQuery) {
        observableQuery.refetch();
      },
    });
  };

  return (
    <>
      {errorMsg && (
        <div className="mt-4">
          <ErrorBox msg={errorMsg} />
        </div>
      )}
      <div className="py-3">
        <div className="mb-4 grid grid-cols-6 gap-6">
          <Input
            id="engagement-name"
            label="Name"
            value={name ?? ""}
            onChange={(e) => setName(e.target.value)}
            required
            className="col-span-6 sm:col-span-6"
          />

          <div className="col-span-6 sm:col-span-3">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              customInput={<Input label="Start" id="engagement-start-date" />}
            />
          </div>

          <div className="col-span-6 sm:col-span-3">
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              customInput={<Input label="End" id="engagement-end-date" />}
            />
          </div>

          <div className="col-span-6 sm:col-span-6">
            <AssignEngagementTeachers
              staff={staff}
              onAdd={(teacher) => setStaff([...staff, teacher])}
              onRemove={(teacher) =>
                setStaff(staff.filter((t) => t.userId !== teacher.userId))
              }
            />
          </div>
        </div>

        <Modal.Buttons>
          <Modal.Button
            type="confirm"
            onClick={onAddEngagement}
            disabled={!name}
          >
            {loading ? <Spinner /> : "Save"}
          </Modal.Button>
          <Modal.Button type="cancel" onClick={onCancel} ref={cancelButtonRef}>
            Cancel
          </Modal.Button>
        </Modal.Buttons>
      </div>
    </>
  );
}
