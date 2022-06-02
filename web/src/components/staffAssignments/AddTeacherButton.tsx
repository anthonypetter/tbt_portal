import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/solid";
import { assertUnreachable } from "@utils/types";
import clsx from "clsx";
import noop from "lodash/noop";
import { Assignment, TeacherAssignmentType } from "./types";

type Props = {
  onAdd: (assignment: Assignment) => void;
  options: Assignment[];
};

export function AddTeacherButton({ onAdd, options }: Props) {
  const [assign, setAssign] = useState<Assignment | null>(
    options.length > 0 ? options[0] : null
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
        onClick={assign ? () => onAdd(assign) : noop}
      >
        <div className="flex justify-start">
          <PlusIcon className="mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
          <span>{assign?.displayName ?? "Please select an option."}</span>
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
              {options.map((option) => (
                <Menu.Item key={getAssignmentType(option)}>
                  {({ active }) => (
                    <button
                      className={clsx(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "w-full block px-4 py-2 text-sm text-left"
                      )}
                      onClick={() => setAssign(option)}
                    >
                      {option.displayName}
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

export function getAssignmentType(assignment: Assignment) {
  switch (assignment.type) {
    case TeacherAssignmentType.Engagement:
      return assignment.role;

    case TeacherAssignmentType.Cohort:
      return assignment.subject;

    default:
      assertUnreachable(assignment);
  }
}
