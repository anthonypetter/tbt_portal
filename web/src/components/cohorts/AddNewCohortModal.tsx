import { ApolloError, gql, useMutation } from "@apollo/client";
import {
  AddCohortMutation,
  EngagementForAddNewCohortModalFragment,
} from "@generated/graphql";
import {
  normalizeDateFromUTCDateTime,
  normalizeToUtcDate,
} from "@utils/dateTime";
import { fromJust } from "@utils/types";
import { ErrorBox } from "components/ErrorBox";
import { Input } from "components/Input";
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
import {
  ENGAGEMENT_DETAILS_PAGE_QUERY_NAME,
  ORG_DETAIL_PAGE_COHORTS_NAME,
} from "./constants";

const ADD_COHORT = gql`
  mutation AddCohort($input: AddCohortInput!) {
    addCohort(input: $input) {
      id
      name
    }
  }
`;

AddNewCohortModal.fragments = {
  engagement: gql`
    fragment EngagementForAddNewCohortModal on Engagement {
      id
      startDate
      endDate
    }
  `,
};

type Props = {
  engagement: EngagementForAddNewCohortModalFragment;
  show: boolean;
  onCancel: () => void;
  onSuccess: () => void;
};

export function AddNewCohortModal({
  show,
  engagement,
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
        engagement={engagement}
        onCancel={onCancel}
        onSuccess={onSuccess}
      />
    </Modal>
  );
}

type AddCohortModalBodyProps = {
  engagement: EngagementForAddNewCohortModalFragment;
  onCancel: () => void;
  onSuccess: () => void;
};

export function AddCohortModalBody({
  engagement,
  onCancel,
  onSuccess,
}: AddCohortModalBodyProps) {
  const cancelButtonRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [name, setName] = useState<string | null | undefined>();

  const [startDate, setStartDate] = useState<Date | null | undefined>(
    engagement.startDate
      ? normalizeDateFromUTCDateTime(new Date(engagement.startDate))
      : undefined
  );

  const [endDate, setEndDate] = useState<Date | null | undefined>(
    engagement.endDate
      ? normalizeDateFromUTCDateTime(new Date(engagement.endDate))
      : undefined
  );

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
          engagementId: engagement.id,
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
              customInput={
                <Input
                  label="Engagement Start"
                  id="cohort-start-date"
                  disabled
                />
              }
              disabled
            />
          </div>

          <div className="col-span-6 sm:col-span-2">
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              customInput={
                <Input label="Engagement End" id="cohort-end-date" disabled />
              }
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
