import { useRef, useState } from "react";
import { UploadIcon, PaperClipIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import { Button } from "components/Button";
import { Modal } from "components/Modal";
import noop from "lodash/noop";
import { LoadingSkeleton } from "components/LoadingSkeleton";
import { Spinner } from "components/Spinner";
import { FieldError } from "components/FieldError";

export const COHORTS_CSV_FILE_NAME = "csvCohorts";

const IS_DISABLED = true;

export function UploadCsvButton() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [showCsvModal, setShowCsvModal] = useState(false);

  return (
    <>
      <label
        className={clsx(
          "border border-gray-300 rounded-md shadow-sm",
          "px-4 py-2",
          "flex",
          "bg-white text-gray-700 text-base font-medium sm:text-sm",
          IS_DISABLED ? "cursor-not-allowed text-gray-300" : "cursor-pointer"
        )}
      >
        <UploadIcon
          className={clsx(
            "-ml-2 mr-2 h-5 w-5",
            IS_DISABLED ? "text-gray-300" : "text-gray-400"
          )}
          aria-hidden="true"
        />
        <span className="lg:hidden">CSV</span>
        <span className="hidden lg:block">Upload CSV</span>
        <input
          ref={inputRef}
          disabled={IS_DISABLED}
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
              console.log(file);
              setFile(file);
              setShowCsvModal(true);
            }
          }}
        />
      </label>
      <CohortCsvModal
        show={showCsvModal}
        file={file}
        closeModal={() => setShowCsvModal(false)}
        afterLeave={() => setFile(null)}
      />
    </>
  );
}

type CohortCsvModalProps = {
  show: boolean;
  file: File | null;
  closeModal: () => void;
  afterLeave: () => void;
};

function CohortCsvModal({
  show,
  closeModal,
  afterLeave,
  file,
}: CohortCsvModalProps) {
  return (
    <Modal
      show={show}
      onClose={noop}
      icon={
        <Modal.Icon className="bg-blue-100">
          <UploadIcon className="w-6 h-6 text-blue-600" aria-hidden="true" />
        </Modal.Icon>
      }
      title="CSV Upload"
      width="large"
      afterLeave={afterLeave}
    >
      {file ? (
        <CohortCsvModalBody
          file={file}
          onCancel={closeModal}
          onSuccess={closeModal}
        />
      ) : (
        <LoadingSkeleton />
      )}
    </Modal>
  );
}

type CohortCsvModalBodyProps = {
  file: File;
  onCancel: () => void;
  onSuccess: () => void;
};

type ValidationError = { message: string; hint?: string };

type CsvValidationResponse = {
  message: string;
  validationResults?: ValidationError[];
};

function CohortCsvModalBody({
  file,
  onCancel,
  onSuccess,
}: CohortCsvModalBodyProps) {
  const cancelButtonRef = useRef(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );

  const loading = false;

  const validate = async () => {
    const formData = new FormData();
    formData.append(COHORTS_CSV_FILE_NAME, file);
    setIsValidating(true);
    setValidationErrors([]);

    const response: CsvValidationResponse = await fetch("/api/csv-validate", {
      method: "POST",
      body: formData,
    }).then((resp) => resp.json());

    console.log("response", response);

    setValidationErrors(response.validationResults ?? []);
    setIsValidating(false);
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center w-full">
          <div className="p-2 flex border rounded-md flex-1 mr-8">
            <PaperClipIcon
              className="w-5 h-5 text-blue-500 mr-3"
              aria-hidden="true"
            />

            <div className="">
              <p className="text-gray-700 text-base font-medium sm:text-sm">
                {file.name}
              </p>
            </div>
          </div>

          <Button theme="tertiary" onClick={() => validate()}>
            <span>Validate</span>
          </Button>
        </div>
      </div>

      <div className="my-4 h-52">
        {isValidating && (
          <div className="flex justify-center">
            <Spinner color="border-blue-500" />
          </div>
        )}
        <div>
          {validationErrors.map((error) => {
            return (
              <FieldError
                key={error.message}
                msg={`${error.message} ${
                  error.hint ? `Details: ${error.hint}` : ""
                }`}
              />
            );
          })}
        </div>
      </div>

      <Modal.Buttons>
        <Modal.Button
          type="confirm"
          onClick={() => console.log("confirm!!!")}
          disabled={true}
        >
          {loading ? <Spinner /> : "Save"}
        </Modal.Button>
        <Modal.Button type="cancel" onClick={onCancel} ref={cancelButtonRef}>
          Cancel
        </Modal.Button>
      </Modal.Buttons>
    </div>
  );
}
