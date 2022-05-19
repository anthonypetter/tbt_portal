import { useRef, useState } from "react";
import { Spinner } from "../Spinner";
import { Modal } from "../Modal";
import { ErrorBox } from "components/ErrorBox";
import { ApolloError, gql, useMutation } from "@apollo/client";
import { EditEngagementMutation } from "@generated/graphql";
import { fromJust } from "@utils/types";
import { Input } from "components/Input";
import { MdWorkspacesOutline } from "react-icons/md";
import noop from "lodash/noop";
import DatePicker from "react-datepicker";
import { QueryEngagements } from "./EngagementsView";
import {
  AddTeachers,
  StaffTeacher,
  toStaffTeacher,
} from "../staffAssignments/AddTeachers";
import { LoadingSkeleton } from "components/LoadingSkeleton";

const REFETCH_QUERIES = ["OrgDetailPageEngagements"];

const EDIT_ENGAGEMENT = gql`
  mutation EditEngagement($input: EditEngagementInput!) {
    editEngagement(input: $input) {
      id
      name
    }
  }
`;

type Props = {
  show: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  engagement: QueryEngagements[number] | null;
};

export function EditEngagementModal({
  show,
  onCancel,
  onSuccess,
  engagement,
}: Props) {
  return (
    <Modal
      show={show}
      onClose={noop}
      icon={
        <div className="flex flex-shrink-0 items-center justify-center mx-auto w-12 h-12 bg-blue-100 rounded-full sm:mx-0 sm:w-10 sm:h-10">
          <MdWorkspacesOutline
            className="w-6 h-6 text-blue-600"
            aria-hidden="true"
          />
        </div>
      }
      title="Edit engagement"
      width="large"
    >
      {engagement ? (
        <EditEngagementModalBody
          onCancel={onCancel}
          onSuccess={onSuccess}
          engagement={engagement}
        />
      ) : (
        <LoadingSkeleton />
      )}
    </Modal>
  );
}

type EditEngagementModalBodyProps = {
  onCancel: () => void;
  onSuccess: () => void;
  engagement: QueryEngagements[number];
};

export function EditEngagementModalBody({
  onCancel,
  onSuccess,
  engagement,
}: EditEngagementModalBodyProps) {
  const cancelButtonRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [name, setName] = useState<string | null | undefined>(engagement.name);
  const [startDate, setStartDate] = useState<Date | null | undefined>(
    engagement.startDate ? new Date(engagement.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | null | undefined>(
    engagement.endDate ? new Date(engagement.endDate) : undefined
  );
  const [staff, setStaff] = useState<StaffTeacher[]>(
    engagement.staffAssignments.map((sa) => toStaffTeacher(sa))
  );

  const [editOrg, { loading }] = useMutation<EditEngagementMutation>(
    EDIT_ENGAGEMENT,
    {
      onError: (err: ApolloError) => setErrorMsg(err.message),
      onCompleted: onSuccess,
    }
  );

  const onEditOrg = async () => {
    await editOrg({
      variables: {
        input: {
          id: engagement.id,
          name: fromJust(name, "name"),
          startDate: startDate ? startDate.getTime() : startDate,
          endDate: endDate ? endDate.getTime() : endDate,
          newStaffAssignments: staff.map((t) => ({
            userId: t.userId,
            assignmentRole: t.assignmentRole,
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
            <AddTeachers
              staff={staff}
              onAdd={(teacher) => setStaff([...staff, teacher])}
              onRemove={(teacher) =>
                setStaff(staff.filter((t) => t.userId !== teacher.userId))
              }
            />
          </div>
        </div>

        <Modal.Buttons>
          <Modal.Button type="confirm" onClick={onEditOrg} disabled={!name}>
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
