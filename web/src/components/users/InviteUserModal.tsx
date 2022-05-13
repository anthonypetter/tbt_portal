import { useRef, useState, useMemo } from "react";
import { UserIcon } from "@heroicons/react/outline";
import { Spinner } from "../Spinner";
import { Modal } from "../Modal";
import { SelectMenu } from "../SelectMenu";
import { ErrorBox } from "components/ErrorBox";
import { ApolloError, gql, useMutation } from "@apollo/client";
import { UserRole } from "@generated/graphql";
import { fromJust } from "@utils/types";
import { Input } from "components/Input";
import { useResetOnShow } from "@utils/useResetOnShow";
import { InviteUserMutation } from "@generated/graphql";

const INVITE_USER = gql`
  mutation InviteUser($input: InviteUserInput!) {
    inviteUser(input: $input) {
      id
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
  const [email, setEmail] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [role, setRole] = useState<UserRole | null>(null);
  const cancelButtonRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [inviteUser, { loading, reset }] = useMutation<InviteUserMutation>(
    INVITE_USER,
    {
      onError: (err: ApolloError) => setErrorMsg(err.message),
      onCompleted: onSuccess,
    }
  );

  // Resetting form here instead of on modal close to prevent flicker.
  useResetOnShow(show, () => {
    reset();
    setErrorMsg(null);
    setEmail("");
    setFullName("");
    setRole(null);
  });

  const onInviteUser = async () => {
    await inviteUser({
      variables: {
        input: {
          email: fromJust(email, "email"),
          fullName: fromJust(fullName, "fullName"),
          role: fromJust(role, "role"),
        },
      },
    });
  };

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
          <div className="space-y-4">
            <Input
              id="invite-user-email"
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              description="An invitation email will be sent to this address."
              placeholder="invitee@tutored.live"
              required
            />

            <Input
              id="invite-user-name"
              label="Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <div>
              <SelectMenu
                labelText="Role"
                options={options}
                onSelect={(option) => setRole(option.role)}
                required
              />
            </div>
          </div>
        </div>
        {errorMsg && <ErrorBox msg={errorMsg} />}
        <Modal.Buttons>
          <Modal.Button
            type="confirm"
            onClick={onInviteUser}
            disabled={!email || !role || !fullName}
          >
            {loading ? <Spinner /> : "Invite"}
          </Modal.Button>
          <Modal.Button type="cancel" onClick={onCancel} ref={cancelButtonRef}>
            Cancel
          </Modal.Button>
        </Modal.Buttons>
      </div>
    </Modal>
  );
}
