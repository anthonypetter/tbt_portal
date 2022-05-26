import { useState, Fragment, ReactNode } from "react";
import { usePopper } from "react-popper";
import { Menu, Transition } from "@headlessui/react";
import { DotsHorizontalIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import noop from "lodash/noop";

export function DotsMenu({ children }: { children: ReactNode }) {
  // Using popper to address this issue: https://github.com/tailwindlabs/tailwindui-issues/issues/147
  const [refElement, setRefElement] = useState<HTMLSpanElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const { styles, attributes, update } = usePopper(refElement, popperElement);

  return (
    <Menu>
      <Menu.Button
        ref={setRefElement}
        className={clsx(
          "flex items-center rounded-full",
          "text-gray-400 hover:text-gray-600 bg-gray-50",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100"
        )}
        onClick={() => {
          update ? update() : noop();
        }}
      >
        <span className="sr-only">Open options</span>
        <DotsHorizontalIcon className="w-5 h-5" aria-hidden="true" />
      </Menu.Button>

      <div
        style={styles.popper}
        {...attributes.popper}
        ref={setPopperElement}
        className="z-10"
      >
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100 "
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          {children}
        </Transition>
      </div>
    </Menu>
  );
}
