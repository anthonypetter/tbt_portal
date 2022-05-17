/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/solid";
import { AssignmentRole } from "@generated/graphql";
import { assertUnreachable } from "@utils/types";
import clsx from "clsx";

type Props = {
  onAdd: (assignAs: AssignmentRole) => void;
};

const assignmentRoles = [
  { value: AssignmentRole.MentorTeacher, displayName: "Mentor Teacher" },
  {
    value: AssignmentRole.SubstituteTeacher,
    displayName: "Substitute Teacher",
  },
];

export function AddTeacherButton({ onAdd }: Props) {
  const [assignAs, setAssignAs] = useState<AssignmentRole>(
    AssignmentRole.MentorTeacher
  );

  return (
    <div className="relative z-0 inline-flex shadow-sm rounded-md">
      <button
        type="button"
        className={clsx(
          "px-2 py-2",
          "focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500",
          "border border-gray-300 rounded-l-md",
          "relative inline-flex items-center min-w-[170px]",
          "bg-white hover:bg-gray-50",
          "text-sm font-medium text-gray-700"
        )}
        onClick={() => onAdd(assignAs)}
      >
        <div className="flex justify-start">
          <PlusIcon className="mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
          <span>{getDisplayName(assignAs)}</span>
        </div>
      </button>

      <Menu as="div" className="-ml-px relative block">
        <Menu.Button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
          <span className="sr-only">Open options</span>
          <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="origin-top-right absolute right-0 mt-2 -mr-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {assignmentRoles.map((item) => (
                <Menu.Item key={item.value}>
                  {({ active }) => (
                    <button
                      className={clsx(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "w-full block px-4 py-2 text-sm text-left"
                      )}
                      onClick={() => setAssignAs(item.value)}
                    >
                      {item.displayName}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}

function getDisplayName(assignmentRole: AssignmentRole) {
  switch (assignmentRole) {
    case AssignmentRole.MentorTeacher:
      return "Mentor Teacher";

    case AssignmentRole.SubstituteTeacher:
      return "Substitute Teacher";

    case AssignmentRole.GeneralTeacher:
      return "General Teacher";

    default:
      assertUnreachable(assignmentRole);
  }
}
