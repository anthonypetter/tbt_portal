import { useRef } from "react";
import { ExclamationIcon } from "@heroicons/react/outline";
import { Button } from "./Button";
import { Modal } from "./Modal";
import { Spinner } from "./Spinner";
import { ErrorBox } from "./ErrorBox";

export function DeleteModal({
  title,
  message,
  show,
  onCancel,
  onDelete,
  deleting,
  error,
}: {
  title: string;
  message?: string;
  show: boolean;
  onCancel: () => void;
  onDelete: () => void;
  deleting: boolean;
  error?: string | null;
}) {
  const cancelButtonRef = useRef(null);

  return (
    <Modal
      show={show}
      onClose={onCancel}
      icon={
        <ExclamationIcon className="w-6 h-6 text-red-600" aria-hidden="true" />
      }
      title={title}
      initialFocus={cancelButtonRef}
    >
      {message && <p className="text-gray-500 text-sm">{message}</p>}
      {error && (
        <div className="mt-4">
          <ErrorBox />
        </div>
      )}
      <Modal.Buttons>
        <Button
          theme="danger"
          className="px-4 w-full sm:ml-3 sm:w-20"
          onClick={onDelete}
        >
          {deleting ? <Spinner /> : "Delete"}
        </Button>
        <Button
          theme="tertiary"
          className="mt-3 px-4 w-full sm:mt-0 sm:w-auto"
          onClick={onCancel}
          ref={cancelButtonRef}
        >
          Cancel
        </Button>
      </Modal.Buttons>
    </Modal>
  );
}
