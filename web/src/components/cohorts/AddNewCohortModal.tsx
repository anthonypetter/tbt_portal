import { useRef, useState } from "react";
import { Spinner } from "../Spinner";
import { Modal } from "../Modal";
import { ErrorBox } from "components/ErrorBox";
import { ApolloError, gql, useMutation } from "@apollo/client";
import { AddCohortMutation } from "@generated/graphql";
import { fromJust } from "@utils/types";
import { Input } from "components/Input";
import { MdWorkspacesOutline } from "react-icons/md";
import noop from "lodash/noop";
import DatePicker from "react-datepicker";
import {
  AddCohortTeachers,
  CohortStaffTeacher,
} from "../staffAssignments/AddCohortTeachers";
import { EngagementDetailPageQueryName } from "./constants";

const ADD_COHORT = gql`
  mutation AddCohort($input: AddCohortInput!) {
    addCohort(input: $input) {
      id
      name
    }
  }
`;

type Props = {
  engagementId: string;
  show: boolean;
  onCancel: () => void;
  onSuccess: () => void;
};

export function AddNewCohortModal({
  show,
  engagementId,
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
      title="Add new cohort"
      width="large"
    >
      <AddCohortModalBody
        engagementId={engagementId}
        onCancel={onCancel}
        onSuccess={onSuccess}
      />
    </Modal>
  );
}

type AddCohortModalBodyProps = {
  engagementId: string;
  onCancel: () => void;
  onSuccess: () => void;
};

export function AddCohortModalBody({
  engagementId,
  onCancel,
  onSuccess,
}: AddCohortModalBodyProps) {
  const cancelButtonRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [name, setName] = useState<string | null | undefined>();
  const [startDate, setStartDate] = useState<Date | null | undefined>();
  const [endDate, setEndDate] = useState<Date | null | undefined>();
  const [grade, setGrade] = useState<string | null | undefined>();
  const [hostKey, setHostKey] = useState<string | null | undefined>();
  const [meetingRoom, setMeetingRoom] = useState<string | null | undefined>();
  const [staff, setStaff] = useState<CohortStaffTeacher[]>([]);

  const [addCohort, { loading }] = useMutation<AddCohortMutation>(ADD_COHORT, {
    onError: (err: ApolloError) => setErrorMsg(err.message),
    onCompleted: onSuccess,
  });

  const onAddEngagement = async () => {
    await addCohort({
      variables: {
        input: {
          name: fromJust(name, "name"),
          engagementId,
          startDate: startDate ? startDate.getTime() : startDate,
          endDate: endDate ? endDate.getTime() : endDate,
          grade: grade,
          hostKey: hostKey,
          meetingRoom: meetingRoom,
          newStaffAssignments: staff.map((t) => ({
            userId: t.userId,
            subject: t.subject,
          })),
        },
      },
      refetchQueries: [EngagementDetailPageQueryName],
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
          <div className="col-span-6 sm:col-span-5">
            <Input
              id="cohort-name"
              label="Name"
              value={name ?? ""}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="col-span-6 sm:col-span-1">
            <Input
              id="cohort-grade"
              label="Grade"
              value={grade ?? ""}
              onChange={(e) => setGrade(e.target.value)}
            />
          </div>

          <div className="col-span-6 sm:col-span-2">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              customInput={<Input label="Start" id="cohort-start-date" />}
            />
          </div>

          <div className="col-span-6 sm:col-span-2">
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              customInput={<Input label="End" id="cohort-end-date" />}
            />
          </div>

          <div className="col-span-6 sm:col-span-2">
            <Input
              id="cohort-hostkey"
              label="Host Key"
              value={hostKey ?? ""}
              onChange={(e) => setHostKey(e.target.value)}
            />
          </div>

          <div className="col-span-6 sm:col-span-6">
            <Input
              id="cohort-meeting-room"
              label="Meeting Room"
              value={meetingRoom ?? ""}
              onChange={(e) => setMeetingRoom(e.target.value)}
            />
          </div>

          <div className="col-span-6 sm:col-span-6">
            <AddCohortTeachers
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
