import { useRef, useState } from "react";
import { Spinner } from "../Spinner";
import { Modal } from "../Modal";
import { ErrorBox } from "components/ErrorBox";
import { ApolloError, gql, useMutation } from "@apollo/client";
import {
  EditEngagementMutation,
  CohortForTableFragment,
} from "@generated/graphql";
import { fromJust } from "@utils/types";
import { Input } from "components/Input";
import { MdWorkspacesOutline } from "react-icons/md";
import noop from "lodash/noop";
import DatePicker from "react-datepicker";
import {
  AssignCohortTeachers,
  CohortStaffTeacher,
  toCohortStaffTeacher,
} from "../staffAssignments/AssignCohortTeachers";
import { LoadingSkeleton } from "components/LoadingSkeleton";
import {
  ENGAGEMENT_DETAILS_PAGE_QUERY_NAME,
  ORG_DETAIL_PAGE_COHORTS_NAME,
} from "./constants";

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
  closeModal: () => void;
  cohort: CohortForTableFragment | null;
  afterLeave: () => void;
};

export function EditCohortModal({
  show,
  closeModal,
  cohort,
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
      title="Edit cohort"
      width="large"
      afterLeave={afterLeave}
    >
      {cohort ? (
        <EditCohortModalBody
          onCancel={() => closeModal()}
          onSuccess={() => closeModal()}
          cohort={cohort}
        />
      ) : (
        <LoadingSkeleton />
      )}
    </Modal>
  );
}

type EditCohortModalBodyProps = {
  onCancel: () => void;
  onSuccess: () => void;
  cohort: CohortForTableFragment;
};

export function EditCohortModalBody({
  onCancel,
  onSuccess,
  cohort,
}: EditCohortModalBodyProps) {
  const cancelButtonRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [name, setName] = useState<string | null | undefined>(cohort.name);
  const [startDate, setStartDate] = useState<Date | null | undefined>(
    cohort.startDate ? new Date(cohort.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | null | undefined>(
    cohort.endDate ? new Date(cohort.endDate) : undefined
  );
  const [grade, setGrade] = useState<string | null | undefined>(cohort.grade);
  const [hostKey, setHostKey] = useState<string | null | undefined>(
    cohort.hostKey
  );
  const [meetingRoom, setMeetingRoom] = useState<string | null | undefined>(
    cohort.meetingRoom
  );
  const [staff, setStaff] = useState<CohortStaffTeacher[]>(
    cohort.staffAssignments.map((sa) => toCohortStaffTeacher(sa))
  );

  const [editOrg, { loading }] = useMutation<EditEngagementMutation>(
    EDIT_COHORT,
    {
      onError: (err: ApolloError) => setErrorMsg(err.message),
      onCompleted: onSuccess,
    }
  );

  const onEditOrg = async () => {
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
            subject: t.subject,
          })),
        },
      },
      refetchQueries: [
        ENGAGEMENT_DETAILS_PAGE_QUERY_NAME,
        ORG_DETAIL_PAGE_COHORTS_NAME,
      ],
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
            <AssignCohortTeachers
              staff={staff}
              onAdd={(teacher) => setStaff([...staff, teacher])}
              onRemove={(teacher) => {
                const isTeacherToRemove = (t: CohortStaffTeacher) =>
                  t.subject === teacher.subject && t.userId === teacher.userId;

                setStaff(staff.filter((t) => !isTeacherToRemove(t)));
              }}
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
