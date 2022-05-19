import { PencilIcon } from "@heroicons/react/solid";
import clsx from "clsx";

export function EditIconButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className={clsx(
        "inline-flex items-center rounded-md",
        "text-sm font-medium text-gray-700",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-blue-500"
      )}
      onClick={onClick}
    >
      <PencilIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
    </button>
  );
}
