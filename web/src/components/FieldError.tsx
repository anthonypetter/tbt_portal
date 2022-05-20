import { ExclamationCircleIcon } from "@heroicons/react/solid";

export function FieldError({ msg }: { msg: string }) {
  return (
    <span className="mt-1 flex items-center text-sm text-red-500">
      <ExclamationCircleIcon
        className="w-4 h-4 text-red-400 mr-2 flex-shrink-0"
        aria-hidden="true"
      />
      {msg}
    </span>
  );
}
