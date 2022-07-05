import { CsvUploadView_EngagementFragment } from "@generated/graphql";
import { ProcessedCohort } from "@utils/csv/parseCsv";
import { Button } from "components/Button";
import { ErrorBox } from "components/ErrorBox";
import { FieldError } from "components/FieldError";
import { Spinner } from "components/Spinner";
import { useState } from "react";
import { COHORTS_CSV_FILE_NAME } from "./CsvUploadView";

type ValidationError = { message: string; hint?: string };

type Props = {
  file: File | null;
  onPassValidation: (processedCsv: ProcessedCohort[]) => void;
  filePreviouslyPassedValidation: boolean;
  engagement: CsvUploadView_EngagementFragment;
};

export function StepTwoValidateCsv({
  file,
  onPassValidation,
  filePreviouslyPassedValidation,
  engagement,
}: Props) {
  if (!file) {
    return null;
  }

  return (
    <ValidateFile
      file={file}
      onPassValidation={onPassValidation}
      filePreviouslyPassedValidation={filePreviouslyPassedValidation}
      engagement={engagement}
    />
  );
}

type CsvValidationResponse = {
  message: string;
  validationErrors?: ValidationError[];
  processedCsv?: ProcessedCohort[];
};

enum Status {
  NotYetValidated,
  Validating,
  ValidationFailed,
  ValidationPassed,
  ErrorWhileValidating,
}

type ValidationState =
  | { status: Status.NotYetValidated }
  | { status: Status.Validating }
  | { status: Status.ValidationFailed; errors: ValidationError[] }
  | { status: Status.ValidationPassed }
  | { status: Status.ErrorWhileValidating; errorMsg: string };

type ValidateFileProps = {
  file: File;
  onPassValidation: (processedCsv: ProcessedCohort[]) => void;
  filePreviouslyPassedValidation: boolean;
  engagement: CsvUploadView_EngagementFragment;
};

function ValidateFile({
  file,
  onPassValidation,
  filePreviouslyPassedValidation,
  engagement,
}: ValidateFileProps) {
  const [validationState, setValidationState] = useState<ValidationState>(
    filePreviouslyPassedValidation
      ? { status: Status.ValidationPassed }
      : {
          status: Status.NotYetValidated,
        }
  );

  const validate = async () => {
    const formData = new FormData();
    formData.append(COHORTS_CSV_FILE_NAME, file);
    formData.append("startDate", engagement.startDate);
    formData.append("endDate", engagement.endDate);
    setValidationState({ status: Status.Validating });

    try {
      const { message, validationErrors, processedCsv }: CsvValidationResponse =
        await fetch("/api/validate-csv", {
          method: "POST",
          body: formData,
        }).then((resp) => resp.json());

      if (!validationErrors) {
        throw new Error(message);
      }

      if (validationErrors.length === 0) {
        if (!processedCsv) {
          throw new Error(
            "Did not find errors but was still unable to parse CSV."
          );
        }

        setValidationState({ status: Status.ValidationPassed });
        onPassValidation(processedCsv);
      } else {
        setValidationState({
          status: Status.ValidationFailed,
          errors: validationErrors,
        });
      }
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : "An error was encountered during validation.";
      setValidationState({ status: Status.ErrorWhileValidating, errorMsg });
    }
  };

  return (
    <>
      <div className="flex items-start mt-4">
        <Button theme="tertiary" onClick={() => validate()}>
          Validate CSV
        </Button>
        <div className="ml-4">
          {validationState.status === Status.Validating && (
            <div className="mt-3">
              <Spinner color="border-blue-500" />
            </div>
          )}
          {validationState.status === Status.ValidationPassed && (
            <div className="mt-[6px]">
              <span className="text-sm text-green-600">Validation passed!</span>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4">
        {validationState.status === Status.ErrorWhileValidating && (
          <ErrorBox msg={validationState.errorMsg} />
        )}

        {validationState.status === Status.ValidationFailed && (
          <div className="ml-4 mt-2">
            {validationState.errors.map((error) => {
              return (
                <FieldError
                  key={error.message}
                  msg={`${error.message} ${error.hint ? error.hint : ""}`}
                />
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
