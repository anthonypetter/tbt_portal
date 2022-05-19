import { useRef, useState } from "react";
import { Spinner } from "../Spinner";
import { Modal } from "../Modal";
import { ErrorBox } from "components/ErrorBox";
import { ApolloError, gql, useMutation } from "@apollo/client";
import { EditEngagementMutation } from "@generated/graphql";
import { fromJust } from "@utils/types";
import { Input } from "components/Input";
import { useResetOnShow } from "@utils/useResetOnShow";
import { MdWorkspacesOutline } from "react-icons/md";
import noop from "lodash/noop";
import DatePicker from "react-datepicker";
import { QueryCohorts } from "./CohortsView";
import {
  AddTeachers,
  StaffTeacher,
  toStaffTeacher,
} from "../staffAssignments/AddTeachers";

const REFETCH_QUERIES = ["OrgDetailPageCohorts"];

const EDIT_COHORT = gql`
  mutation EditCohort($input: EditCohortInput!) {
    editCohort(input: $input) {
      id
      name
    }
  }
`;

type Props = {
  show: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  cohort: QueryCohorts[number] | null;
};

export function EditCohortModal({
  show,
  onCancel,
  onSuccess,
  cohort: mCohort,
}: Props) {
  const cancelButtonRef = useRef(null);
  //TODO: use react-hook-form to get rid of all of this manual state management.
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [name, setName] = useState<string | null | undefined>();
  const [startDate, setStartDate] = useState<Date | null | undefined>();
  const [endDate, setEndDate] = useState<Date | null | undefined>();
  const [grade, setGrade] = useState<string | null | undefined>();
  const [hostKey, setHostKey] = useState<string | null | undefined>();
  const [meetingRoom, setMeetingRoom] = useState<string | null | undefined>();
  const [staff, setStaff] = useState<StaffTeacher[]>([]);

  // Edit Mutation
  const [editOrg, { loading, reset }] = useMutation<EditEngagementMutation>(
    EDIT_COHORT,
    {
      onError: (err: ApolloError) => setErrorMsg(err.message),
      onCompleted: onSuccess,
    }
  );

  useResetOnShow(show, () => {
    const cohort = fromJust(mCohort, "cohort");
    reset();
    setErrorMsg(null);
    setName(cohort.name);
    setStartDate(cohort.startDate ? new Date(cohort.startDate) : undefined);
    setEndDate(cohort.endDate ? new Date(cohort.endDate) : undefined);
    setGrade(cohort.grade ?? undefined);
    setHostKey(cohort.hostKey ?? undefined);
    setMeetingRoom(cohort.meetingRoom ?? undefined);
    setStaff(cohort.staffAssignments.map((sa) => toStaffTeacher(sa)));
  });

  const onEditOrg = async () => {
    const cohort = fromJust(mCohort, "cohort");

    await editOrg({
      variables: {
        input: {
          id: cohort.id,
          name: fromJust(name, "name"),
          startDate: startDate ? startDate.getTime() : startDate,
          endDate: endDate ? endDate.getTime() : endDate,
          grade: grade,
          hostKey: hostKey,
          meetingRoom: meetingRoom,
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
      title="Edit cohort"
      width="large"
    >
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
    </Modal>
  );
}
