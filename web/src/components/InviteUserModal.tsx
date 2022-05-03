import { useRef, useState, useEffect, useMemo } from "react";
import { UserIcon } from "@heroicons/react/outline";
import { Button } from "./Button";
import { Spinner } from "./Spinner";
import { Modal } from "./Modal";
import { SelectMenu } from "./SelectMenu";
import { ErrorBox } from "components/ErrorBox";
import { gql } from "@apollo/client";
import { UserRole, useInviteUserMutation } from "@generated/graphql";
import { fromJust } from "@utils/types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const INVITE_USER = gql`
  mutation InviteUser($email: String!, $role: UserRole!) {
    inviteUser(email: $email, role: $role) {
      inviteSent
    }
  }
`;

export function InviteUserModal({
  show,
  onCancel: onCancelProp,
  onSuccess,
}: {
  show: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const [inviting, setInviting] = useState(false);
  const cancelButtonRef = useRef(null);
  const [inviteUser] = useInviteUserMutation();
  const [inviteFailure, setInviteFailure] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    if (show) {
      setInviting(false);
      setInviteFailure(null);
    }
  }, [show]);

  const onInviteUser = async () => {
    setInviting(true);

    try {
      const { data } = await inviteUser({
        variables: { email, role: fromJust(role, "role") },
      });

      if (!data?.inviteUser.inviteSent) {
        setInviting(false);
        throw new Error("Something went wrong with the invite.");
      }

      setInviting(false);
      onSuccess();
    } catch (error: unknown) {
      console.error(error);

      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong with the invite.";

      setInviting(false);
      setInviteFailure(message);
    }
  };

  const onCancel = () => {
    onCancelProp();
  };

  const body = (
    <div className="py-3">
      <div className="mb-4">
        <InviteUserForm email={email} setEmail={setEmail} setRole={setRole} />
      </div>
      {inviteFailure && <ErrorBox />}
    </div>
  );

  const icon = (
    <div className="flex flex-shrink-0 items-center justify-center mx-auto w-12 h-12 bg-green-100 rounded-full sm:mx-0 sm:w-10 sm:h-10">
      {<UserIcon className="w-6 h-6 text-green-600" aria-hidden="true" />}
    </div>
  );

  return (
    <Modal
      show={show}
      onClose={onCancel}
      icon={icon}
      title="Invite a User"
      body={body}
      buttons={
        <>
          <Button
            theme="primary"
            className="px-4 w-full sm:ml-3 sm:w-20"
            onClick={onInviteUser}
            disabled={!email || !role}
          >
            {inviting ? <Spinner /> : "Invite"}
          </Button>
          <Button
            theme="tertiary"
            className="mt-3 px-4 w-full sm:mt-0 sm:w-auto"
            onClick={onCancel}
            ref={cancelButtonRef}
          >
            Cancel
          </Button>
        </>
      }
    />
  );
}

type Props = {
  email: string;
  setEmail: (email: string) => void;
  setRole: (role: UserRole | null) => void;
};

function InviteUserForm({ email, setEmail, setRole }: Props) {
  //TODO: Add email format validation
  const options = useMemo(
    () => [
      { id: "NONE_SELECTED", name: "Select an option", role: null },
      { id: "1", name: "Administrator", role: UserRole.Admin },
      { id: "2", name: "Mentor Teacher", role: UserRole.MentorTeacher },
      { id: "3", name: "Tutor Teacher", role: UserRole.TutorTeacher },
    ],
    []
  );

  return (
    <div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <div className="mt-1">
          <input
            type="email"
            name="email"
            id="email"
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="invitee@tutored.live"
            aria-describedby="email-description"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <p className="mt-2 text-sm text-gray-500" id="email-description">
          {"This will trigger an invitation email."}
        </p>
      </div>

      <div className="mt-1">
        <SelectMenu
          labelText="Role"
          options={options}
          onSelect={(option) => setRole(option.role)}
        />
        <p className="mt-2 text-sm text-gray-500" id="email-description">
          {"The user will be given different permissions based on their role."}
        </p>
      </div>
    </div>
  );
}
