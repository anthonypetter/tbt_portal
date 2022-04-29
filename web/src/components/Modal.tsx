import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import clsx from "clsx";
import { ErrorBox } from "./ErrorBox";

type Props = {
  show: boolean;
  buttons: React.ReactNode;
  onClose: () => void;
  icon: React.ReactNode;
  title: string;
  body: React.ReactNode;
  initialFocus?: React.MutableRefObject<HTMLElement | null> | undefined;
  error?: string | null;
};

export function Modal({
  show,
  buttons,
  onClose,
  icon,
  title,
  body,
  initialFocus,
  error,
}: Props) {
  return (
    <Transition.Root show={show} as={React.Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={initialFocus}
        onClose={onClose}
      >
        {/* Layer covers entire screen and centers content */}
        <div
          className={clsx(
            "flex items-end justify-center",
            "min-h-screen text-center sm:block",
            "pb-20 pt-4 px-4  sm:p-0"
          )}
        >
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          {/* This is the actual modal content */}
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              className={clsx(
                "w-full border relative inline-block text-left",
                "pb-4 pt-5 px-4 sm:mt-8 sm:mb-60 sm:p-6 sm:max-w-lg",
                "align-bottom sm:align-middle",
                "bg-white rounded-lg shadow-xl",
                "transform transition-all"
              )}
            >
              <div className="sm:flex items-center">
                <div>{icon}</div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <Dialog.Title
                    as="h3"
                    className="text-gray-900 text-lg font-medium leading-6"
                  >
                    {title}
                  </Dialog.Title>
                </div>
              </div>
              <div className="mt-2">{body}</div>
              {error && <ErrorBox msg={error} />}
              <div className="mt-5 sm:flex sm:flex-row-reverse sm:mt-4">
                {buttons}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
