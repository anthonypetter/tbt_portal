import { DotsMenu } from "./DotsMenu";
import { Menu } from "@headlessui/react";
import { MailIcon, PencilAltIcon, TrashIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import { UserTableData } from "./users/UsersTable";
import { ApolloError, gql, useMutation } from "@apollo/client";
import { InviteUserMutation } from "@generated/graphql";
import { fromJust } from "@utils/types";
import { UserRole } from "@generated/graphql";
import toast from "react-hot-toast";

const INVITE_USER = gql`
  mutation InviteUser($input: InviteUserInput!) {
    inviteUser(input: $input) {
      id
    }
  }
`;

type Props = {
  userData: UserTableData
  onClickEdit?: () => void;
  onClickDelete?: () => void;
};

export function ContextMenu({ userData, onClickEdit, onClickDelete }: Props) {
  const [inviteUser] = useMutation<InviteUserMutation>(
    INVITE_USER,
    {
      onError: (error: ApolloError) => { toast.error(error.message) },
      onCompleted: () => toast.success("Invite sent")
    }
  )

  const handleOnSendInvite = async (userData: UserTableData) => {
    switch (userData.role) {
      case "Admin": userData.role = UserRole.Admin
        break;
      case "Mentor Teacher": userData.role = UserRole.MentorTeacher
        break;
      case "Tutor Teacher": userData.role = UserRole.TutorTeacher
        break;
      default:
        break;
    }

    await inviteUser({
      variables: {
        input: {
          email: fromJust(userData.email, "email"),
          fullName: fromJust(userData.fullName, "fullName"),
          role: fromJust(userData.role, "role"),
        },
      },
    });
  }

  return (
    <DotsMenu>
      <Menu.Items className="absolute z-10 right-0 mt-2 w-56 bg-white rounded-md focus:outline-none shadow-lg origin-top-right ring-1 ring-black ring-opacity-5">
        <div className="py-1">
          <Menu.Item>
            {({ active }) => {
              const isDisabled = onClickEdit == null;

              return (
                <button
                  disabled={isDisabled}
                  className={clsx(
                    "group flex items-center px-4 py-2 w-full text-sm",
                    isDisabled
                      ? "text-gray-300"
                      : active
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-700"
                  )}
                  {...(onClickEdit ? { onClick: onClickEdit } : {})}
                >
                  <PencilAltIcon
                    className={clsx(
                      "mr-3 w-4 h-4",
                      isDisabled
                        ? "text-gray-300"
                        : "text-gray-400 group-hover:text-gray-500"
                    )}
                    aria-hidden="true"
                  />
                  Edit
                </button>
              );
            }}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => {
              const isDisabled = onClickDelete == null;

              return (
                <button
                  disabled={isDisabled}
                  className={clsx(
                    isDisabled
                      ? "text-gray-300"
                      : active
                        ? "bg-red-600 text-white"
                        : "text-red-600",
                    "group flex items-center px-4 py-2 w-full text-sm"
                  )}
                  {...(onClickDelete ? { onClick: onClickDelete } : {})}
                >
                  <TrashIcon
                    className={clsx(
                      "mr-3 w-4 h-4",
                      isDisabled
                        ? "text-gray-300"
                        : "text-red-600 group-hover:text-white"
                    )}
                    aria-hidden="true"
                  />
                  Delete
                </button>
              );
            }}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => {
              const isDisabled = userData.accountStatus.toLowerCase() !== "pending";
              return (
                <button
                  disabled={isDisabled}
                  className={clsx(
                    isDisabled
                      ? "text-gray-300"
                      : active
                        ? "bg-red-600 text-white"
                        : "text-red-600",
                    "group flex items-center px-4 py-2 w-full text-sm"
                  )}
                  onClick={() => handleOnSendInvite(userData)}
                >
                  <MailIcon
                    className={clsx(
                      "mr-3 w-4 h-4",
                      isDisabled
                        ? "text-gray-300"
                        : "text-red-600 group-hover:text-white"
                    )}
                    aria-hidden="true"
                  />
                  Invite User
                </button>
              );
            }}
          </Menu.Item>
        </div>
      </Menu.Items>
    </DotsMenu>
  );
}
