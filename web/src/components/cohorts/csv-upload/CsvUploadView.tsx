import { useState } from "react";
import { EngagementDetailsPageCsvUploadFragment } from "@generated/graphql";
import { ErrorBoundary } from "components/ErrorBoundary";
import { ErrorBox } from "components/ErrorBox";
import { Stepper, StepStatus } from "components/Stepper";
import { Button } from "components/Button";
import { StepOneUploadCsv } from "./StepOneUploadCsv";
import { StepTwoValidateCsv } from "./StepTwoValidateCsv";
import { ProcessedCohort } from "@utils/csv/parseCsv";
import { StepThreeReview } from "./StepThreeReview";
import { StepFourSubmit } from "./StepFourSubmit";

type Props = {
  engagement: EngagementDetailsPageCsvUploadFragment;
};

export const COHORTS_CSV_FILE_NAME = "csvCohorts";

enum Step {
  Upload,
  Validate,
  Review,
  Submit,
}

export function CsvUploadView({ engagement }: Props) {
  const [currentStep, setCurrentStep] = useState<Step>(Step.Upload);
  const [file, setFile] = useState<File | null>(null);
  const [processedCsv, setProcessedCsv] = useState<ProcessedCohort[] | null>(
    null
  );

  const steps = [
    {
      name: "Upload",
      body: (
        <StepOneUploadCsv
          file={file}
          onFileUpload={(file) => {
            setCurrentStep(Step.Validate);
            setFile(file);
          }}
        />
      ),
      status: calculateStepStatus(Step.Upload, currentStep),
    },
    {
      name: "Validate",
      body: (
        <StepTwoValidateCsv
          file={file}
          filePreviouslyPassedValidation={currentStep > Step.Validate}
          onPassValidation={(processedCsv) => {
            setProcessedCsv(processedCsv);
            setCurrentStep(Step.Review);
          }}
        />
      ),
      status: calculateStepStatus(Step.Validate, currentStep),
    },
    {
      name: "Review",
      body: (
        <StepThreeReview
          engagement={engagement}
          processedCsv={processedCsv}
          onApprove={() => setCurrentStep(Step.Submit)}
        />
      ),
      status: calculateStepStatus(Step.Review, currentStep),
    },
    {
      name: "Submit",
      body: <StepFourSubmit disabled={currentStep !== Step.Submit} />,
      status: calculateStepStatus(Step.Submit, currentStep),
    },
  ];

  return (
    <ErrorBoundary fallbackRender={() => <ErrorBox className="mt-4" />}>
      <main className="relative flex-col my-6">
        <Stepper steps={steps} />
        <div className="absolute right-6 top-0">
          <Button
            theme="secondary"
            onClick={() => {
              setCurrentStep(Step.Upload);
              setFile(null);
              setProcessedCsv(null);
            }}
          >
            Start over
          </Button>
        </div>
      </main>
    </ErrorBoundary>
  );
}

function calculateStepStatus(step: Step, currentStep: Step): StepStatus {
  if (step === currentStep) {
    return StepStatus.Current;
  }

  if (currentStep > step) {
    return StepStatus.Complete;
  }

  return StepStatus.Upcoming;
}
