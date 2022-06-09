import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import clsx from "clsx";
import { XIcon } from "@heroicons/react/outline";
import { Button, ThemeT } from "./Button";
import { assertUnreachable } from "@utils/types";

type WidthOptions = "medium" | "large" | "xlarge";

type Props = {
  show: boolean;
  children: React.ReactNode;
  onClose: () => void;
  onDismissClick?: () => void;  // Adds X button to corner when defined.
  icon: React.ReactNode;
  title: string;
  initialFocus?: React.MutableRefObject<HTMLElement | null> | undefined;
  width?: WidthOptions;
  afterLeave?: () => void;
};

export function Modal({
  show,
  onClose,
  onDismissClick,
  icon,
  title,
  children,
  initialFocus,
  width = "medium",
  afterLeave,
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
            afterLeave={afterLeave}
          >
            <div
              className={clsx(
                getModalWidth(width),
                "border relative inline-block text-left",
                "pb-4 pt-5 px-4 sm:mt-8 sm:mb-60 sm:p-6",
                "align-bottom sm:align-middle",
                "bg-white rounded-lg shadow-xl",
                "transform transition-all"
              )}
            >
              {onDismissClick && (
                <div
                  className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 cursor-pointer"
                  onClick={onDismissClick}
                >
                  <XIcon className="mr-3 w-6 h-6" aria-hidden="true" />
                </div>
              )}
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
              <div className="mt-2">{children}</div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

function getModalWidth(options: WidthOptions) {
  switch (options) {
    case "medium":
      return "w-full sm:max-w-lg";

    case "large":
      return "w-full sm:max-w-2xl";

    case "xlarge":
      return "w-full sm:max-w-4xl";

    default:
      return "w-full sm:max-w-lg";
  }
}

function ModalButtons({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5 sm:mt-8 sm:flex sm:flex-row-reverse">{children}</div>
  );
}

type ModalButtonType = "confirm" | "cancel" | "delete";

function getButtonStyles(type: ModalButtonType): {
  theme: ThemeT;
  positioning: string;
} {
  switch (type) {
    case "confirm":
      return { theme: "primary", positioning: "sm:ml-3" };

    case "cancel":
      return { theme: "tertiary", positioning: "mt-3 sm:mt-0" };

    case "delete":
      return { theme: "danger", positioning: "sm:ml-3" };

    default:
      assertUnreachable(type, "ModalButtonType");
  }
}

type ModalButtonProps = {
  type: "confirm" | "cancel" | "delete";
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
};

function ModalButtonForwardRef(
  { type, onClick, children, disabled = false }: ModalButtonProps,
  ref: React.Ref<HTMLButtonElement>
) {
  const { theme, positioning } = getButtonStyles(type);

  return (
    <Button
      theme={theme}
      className={`px-4 w-full sm:min-w-[80px] sm:w-auto ${positioning}`}
      onClick={onClick}
      disabled={disabled}
      ref={ref}
    >
      {children}
    </Button>
  );
}

ModalButtonForwardRef.displayName = "ModalButton";

const ModalButton = React.forwardRef<HTMLButtonElement, ModalButtonProps>(
  ModalButtonForwardRef
);

function ModalIcon({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "flex flex-shrink-0 items-center justify-center mx-auto w-12 h-12 rounded-full sm:mx-0 sm:w-10 sm:h-10",
        className
      )}
    >
      {children}
    </div>
  );
}

Modal.Buttons = ModalButtons;
Modal.Button = ModalButton;
Modal.Icon = ModalIcon;
