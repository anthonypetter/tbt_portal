import { ApolloError, gql, useMutation } from "@apollo/client";
import {
  EditCohortModal_CohortFragment,
  EditCohortMutation,
} from "@generated/graphql";
import {
  normalizeDateFromUTCDateTime,
  normalizeToUtcDate,
} from "@utils/dateTime";
import { fromJust } from "@utils/types";
import { ErrorBox } from "components/ErrorBox";
import { Input } from "components/Input";
import { LoadingSkeleton } from "components/LoadingSkeleton";
import noop from "lodash/noop";
import { useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { MdWorkspacesOutline } from "react-icons/md";
import { Modal } from "../Modal";
import { Spinner } from "../Spinner";
import {
  AssignCohortTeachers,
  CohortStaffTeacher,
} from "../staffAssignments/AssignCohortTeachers";

const EDIT_COHORT = gql`
  mutation EditCohort($input: EditCohortInput!) {
    editCohort(input: $input) {
      id
      name
    }
  }
`;

EditCohortModal.fragments = {
  cohort: gql`
    fragment EditCohortModal_Cohort on Cohort {
      id
      name
      startDate
      endDate
      grade
      hostKey
      meetingRoom
      staffAssignments {
        user {
          id
          fullName
          email
        }
        subject
      }
    }
  `,
};

type Props = {
  show: boolean;
  closeModal: () => void;
  cohort: EditCohortModal_CohortFragment | null;
  afterLeave?: () => void;
  /**
   * Use of refetchQueries is a temporary solution.
   * Info: https://www.apollographql.com/docs/react/data/refetching/
   *
   * We shouldn't need to specify query names. Apollo should know what "active" queries
   * need to be refeched.  There's a task to dig into this issue. We can also
   * consider optimistically updating the cache directly as per apollo docs. Regardless,
   * explicitly passing in query names will not scale.
   *
   */
  refetchQueries: string[];
};

export function EditCohortModal({
  show,
  closeModal,
  cohort,
  afterLeave,
  refetchQueries,
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
          refetchQueries={refetchQueries}
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
  cohort: EditCohortModal_CohortFragment;
  refetchQueries: string[];
};

export function EditCohortModalBody({
  onCancel,
  onSuccess,
  cohort,
  refetchQueries,
}: EditCohortModalBodyProps) {
  const cancelButtonRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [name, setName] = useState<string | null | undefined>(cohort.name);

  const [startDate, setStartDate] = useState<Date | null | undefined>(
    cohort.startDate
      ? normalizeDateFromUTCDateTime(new Date(cohort.startDate))
      : undefined
  );

  const [endDate, setEndDate] = useState<Date | null | undefined>(
    cohort.endDate
      ? normalizeDateFromUTCDateTime(new Date(cohort.endDate))
      : undefined
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

  const [editCohort, { loading }] = useMutation<EditCohortMutation>(
    EDIT_COHORT,
    {
      onError: (err: ApolloError) => setErrorMsg(err.message),
      onCompleted: onSuccess,
      refetchQueries,
      onQueryUpdated(observableQuery) {
        observableQuery.refetch();
      },
    }
  );

  const onEditCohort = async () => {
    await editCohort({
      variables: {
        input: {
          id: cohort.id,
          name: fromJust(name, "name"),
          startDate: startDate
            ? normalizeToUtcDate(startDate).getTime()
            : startDate,
          endDate: endDate ? normalizeToUtcDate(endDate).getTime() : endDate,
          grade: grade,
          hostKey: hostKey,
          meetingRoom: meetingRoom,
          newStaffAssignments: staff.map((t) => ({
            userId: t.userId,
            subject: t.subject,
          })),
        },
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
              customInput={
                <Input label="Start" id="cohort-start-date" disabled />
              }
              disabled
            />
          </div>

          <div className="col-span-6 sm:col-span-2">
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              customInput={<Input label="End" id="cohort-end-date" disabled />}
              disabled
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
          <Modal.Button type="confirm" onClick={onEditCohort} disabled={!name}>
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

function toCohortStaffTeacher(
  staffAssignment: EditCohortModal_CohortFragment["staffAssignments"][number]
): CohortStaffTeacher {
  return {
    userId: staffAssignment.user.id,
    fullName: staffAssignment.user.fullName,
    email: staffAssignment.user.email,
    subject: staffAssignment.subject,
  };
}
