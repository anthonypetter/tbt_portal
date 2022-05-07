import { useRef, useState, useEffect, useMemo } from "react";
import { UserIcon } from "@heroicons/react/outline";
import { Spinner } from "../Spinner";
import { Modal } from "../Modal";
import { SelectMenu } from "../SelectMenu";
import { ErrorBox } from "components/ErrorBox";
import { gql } from "@apollo/client";
import { UserRole, useInviteUserMutation } from "@generated/graphql";
import { fromJust } from "@utils/types";
import { Input } from "components/Input";
import { useResetOnShow } from "@utils/useResetOnShow";

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
  onCancel,
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

  // Resetting form here instead of on modal close to prevent user
  // from seeing the form reset. It looks kinda ugly.

  useResetOnShow(show, () => {
    setInviting(false);
    setInviteFailure(null);
    setEmail("");
    setRole(null);
  });

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

  return (
    <Modal
      show={show}
      onClose={onCancel}
      icon={
        <div className="flex flex-shrink-0 items-center justify-center mx-auto w-12 h-12 bg-green-100 rounded-full sm:mx-0 sm:w-10 sm:h-10">
          {<UserIcon className="w-6 h-6 text-green-600" aria-hidden="true" />}
        </div>
      }
      title="Invite a User"
    >
      <div className="py-3">
        <div className="mb-4">
          <InviteUserForm email={email} setEmail={setEmail} setRole={setRole} />
        </div>
        {inviteFailure && <ErrorBox />}
        <Modal.Buttons>
          <Modal.Button
            type="confirm"
            onClick={onInviteUser}
            disabled={!email || !role}
          >
            {inviting ? <Spinner /> : "Invite"}
          </Modal.Button>
          <Modal.Button type="cancel" onClick={onCancel} ref={cancelButtonRef}>
            Cancel
          </Modal.Button>
        </Modal.Buttons>
      </div>
    </Modal>
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
    <div className="space-y-4">
      <Input
        id="invite-user-email"
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        description="This will trigger an invitation email."
        placeholder="invitee@tutored.live"
        required
      />

      <div>
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
