import { ApolloError, gql, useMutation } from "@apollo/client";
import {
  EditEngagementMutation,
  EngagementForEditEngagementModalFragment,
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
  AssignEngagementTeachers,
  EngagementStaffTeacher,
} from "../staffAssignments/AssignEngagementTeachers";

const EDIT_ENGAGEMENT = gql`
  mutation EditEngagement($input: EditEngagementInput!) {
    editEngagement(input: $input) {
      id
      name
    }
  }
`;

EditEngagementModal.fragments = {
  engagement: gql`
    fragment EngagementForEditEngagementModal on Engagement {
      id
      name
      startDate
      endDate
      staffAssignments {
        user {
          id
          fullName
          email
        }
        role
      }
    }
  `,
};

type Props = {
  show: boolean;
  closeModal: () => void;
  engagement: EngagementForEditEngagementModalFragment | null;
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

export function EditEngagementModal({
  show,
  closeModal,
  engagement,
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
      title="Edit engagement"
      width="large"
      afterLeave={afterLeave}
    >
      {engagement ? (
        <EditEngagementModalBody
          onCancel={closeModal}
          onSuccess={closeModal}
          engagement={engagement}
          refetchQueries={refetchQueries}
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
  engagement: EngagementForEditEngagementModalFragment;
  refetchQueries: string[];
};

export function EditEngagementModalBody({
  onCancel,
  onSuccess,
  engagement,
  refetchQueries,
}: EditEngagementModalBodyProps) {
  const cancelButtonRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [name, setName] = useState<string | null | undefined>(engagement.name);

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
          startDate: startDate
            ? normalizeToUtcDate(startDate).getTime()
            : startDate,
          endDate: endDate ? normalizeToUtcDate(endDate).getTime() : endDate,
          newStaffAssignments: staff.map((t) => ({
            userId: t.userId,
            role: t.role,
          })),
        },
      },
      refetchQueries: refetchQueries,
      onQueryUpdated(observableQuery) {
        return observableQuery.refetch();
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

export function toEngagementStaffTeacher(
  staffAssignment: EngagementForEditEngagementModalFragment["staffAssignments"][number]
): EngagementStaffTeacher {
  return {
    userId: staffAssignment.user.id,
    fullName: staffAssignment.user.fullName,
    email: staffAssignment.user.email,
    role: staffAssignment.role,
  };
}
