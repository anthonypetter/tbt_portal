import { UploadCsvButton } from "./UploadCsvButton";
import { PaperClipIcon } from "@heroicons/react/solid";

const UPLOAD_IS_DISABLED = false;

export function StepOneUploadCsv({
  file,
  onFileUpload,
}: {
  file: File | null;
  onFileUpload: (file: File) => void;
}) {
  return file ? (
    <div className="flex mt-2">
      <PaperClipIcon
        className="w-5 h-5 text-blue-500 mr-3"
        aria-hidden="true"
      />
      <span className="text-sm text-gray-500">File: {file.name}</span>
    </div>
  ) : (
    <div className="mt-4">
      <UploadCsvButton
        onFileUpload={onFileUpload}
        disabled={UPLOAD_IS_DISABLED}
      />
    </div>
  );
}
