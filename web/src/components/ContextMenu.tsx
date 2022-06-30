import { DotsMenu } from "./DotsMenu";
import { Menu } from "@headlessui/react";
import { MailIcon, PencilAltIcon, TrashIcon } from "@heroicons/react/solid";
import clsx from "clsx";

type Props = {
  onClickEdit?: () => void;
  onClickDelete?: () => void;
  onClickInviteUser?: () => void;
};

export function ContextMenu({ onClickInviteUser, onClickEdit, onClickDelete }: Props) {
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
              const isDisabled = onClickInviteUser == null;
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
                  {...(onClickInviteUser ? { onClick: onClickInviteUser } : {})}
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
