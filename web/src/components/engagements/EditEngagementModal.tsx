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
import { QueryEngagements } from "./OrganizationEngagementsView";
import {
  AssignEngagementTeachers,
  EngagementStaffTeacher,
  toEngagementStaffTeacher,
} from "../staffAssignments/AssignEngagementTeachers";
import { LoadingSkeleton } from "components/LoadingSkeleton";
import { OrgDetailPageEngagementsQueryName } from "./constants";

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
  closeModal: () => void;
  engagement: QueryEngagements[number] | null;
  afterLeave: () => void;
};

export function EditEngagementModal({
  show,
  closeModal,
  engagement,
  afterLeave,
}: Props) {
  return (
    <Modal
      show={show}
      onClose={noop}
      icon={
        <Modal.Icon className="bg-blue-100">
          <MdWorkspacesOutline
            className="w-6 h-6 text-blue-600"
            aria-hidden="true"
          />
        </Modal.Icon>
      }
      title="Edit engagement"
      width="large"
      afterLeave={afterLeave}
    >
      {engagement ? (
        <EditEngagementModalBody
          onCancel={closeModal}
          onSuccess={closeModal}
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
  const [staff, setStaff] = useState<EngagementStaffTeacher[]>(
    engagement.staffAssignments.map((sa) => toEngagementStaffTeacher(sa))
  );

  const [editEngagement, { loading }] = useMutation<EditEngagementMutation>(
    EDIT_ENGAGEMENT,
    {
      onError: (err: ApolloError) => setErrorMsg(err.message),
      onCompleted: onSuccess,
    }
  );

  const onEditEngagement = async () => {
    await editEngagement({
      variables: {
        input: {
          id: engagement.id,
          name: fromJust(name, "name"),
          startDate: startDate ? startDate.getTime() : startDate,
          endDate: endDate ? endDate.getTime() : endDate,
          newStaffAssignments: staff.map((t) => ({
            userId: t.userId,
            role: t.role,
          })),
        },
      },
      refetchQueries: [OrgDetailPageEngagementsQueryName],
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
              onRemove={(teacher) => {
                const isTeacherToRemove = (t: EngagementStaffTeacher) =>
                  t.role === teacher.role && t.userId === teacher.userId;

                setStaff(staff.filter((t) => !isTeacherToRemove(t)));
              }}
            />
          </div>
        </div>

        <Modal.Buttons>
          <Modal.Button
            type="confirm"
            onClick={onEditEngagement}
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
