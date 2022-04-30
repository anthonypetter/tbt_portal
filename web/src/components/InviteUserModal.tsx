import { useRef, useState } from "react";
import { UserIcon } from "@heroicons/react/outline";
import { Button } from "./Button";
import { Spinner } from "./Spinner";
import { Modal } from "./Modal";
import { SelectMenu } from "./SelectMenu";
import { ErrorBox } from "components/ErrorBox";

export function InviteUserModal({
  show,
  onCancel,
}: {
  show: boolean;
  onCancel: () => void;
}) {
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState(null);
  const cancelButtonRef = useRef(null);

  //TODO: replace me
  const onInvite = () => {
    console.log("INVITE!!!!");
    setInviting(true);
  };

  const body = (
    <div className="py-3">
      <InviteUserForm />
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
            onClick={onInvite}
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

enum UserRole {
  Admin = "ADMIN",
  MentorTeacher = "MENTOR_TEACHER",
  TutorTeacher = "TUTOR_TEACHER",
}

function InviteUserForm() {
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<UserRole | null>(null);
  const [inviteFailure, setInviteFailure] = useState<string | null>(null);

  return (
    <form className="space-y-6" onSubmit={() => console.log("submit!!")}>
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
          options={[
            { id: "1", name: "Administrator" },
            { id: "2", name: "Mentor Teacher" },
            { id: "3", name: "Tutor Teacher" },
          ]}
        />
        <p className="mt-2 text-sm text-gray-500" id="email-description">
          {"The user will be given different permissions based on their role."}
        </p>
      </div>

      {inviteFailure && <ErrorBox />}
    </form>
  );
}
