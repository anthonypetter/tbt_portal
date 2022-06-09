import { useRef } from "react";
import { UploadIcon } from "@heroicons/react/outline";
import clsx from "clsx";

export const COHORTS_CSV_FILE_NAME = "csvCohorts";

type Props = {
  onFileUpload: (file: File) => void;
  disabled?: boolean;
};

export function UploadCsvButton({ onFileUpload, disabled = false }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="flex flex-shrink-0">
      <label
        className={clsx(
          "border border-gray-300 rounded-md shadow-sm",
          "px-4 py-2",
          "flex",
          "bg-white text-gray-700 text-base font-medium sm:text-sm",
          "cursor-pointer",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <UploadIcon
          className={clsx("-ml-2 mr-2 h-5 w-5", "text-gray-400")}
          aria-hidden="true"
        />
        <span className="lg:hidden">CSV</span>
        <span className="hidden lg:block">Upload CSV</span>
        <input
          disabled={disabled}
          ref={inputRef}
          type="file"
          className="hidden"
          onClick={() => {
            // Hack to allow user same file to be selected in same session.
            if (inputRef.current) {
              inputRef.current.value = "";
            }
          }}
          onChange={(event) => {
            if (event.target.files && event.target.files[0]) {
              const file = event.target.files[0];
              onFileUpload(file);
            }
          }}
        />
      </label>
    </div>
  );
}
