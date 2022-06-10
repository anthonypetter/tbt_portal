import { CheckCircleIcon } from "@heroicons/react/solid";
import { ProcessedCohort } from "@utils/csv/parseCsv";
import { Button } from "components/Button";
import { ErrorBox } from "components/ErrorBox";
import { ApolloError, gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { SaveCohortsCsvDataMutation } from "@generated/graphql";
import { Spinner } from "components/Spinner";
import { CSV_UPLOAD_PAGE_QUERY_NAME } from "./constants";

const SAVE_COHORTS_CSV_DATA = gql`
  mutation SaveCohortsCsvData($input: CsvProcessedData!) {
    saveCohortsCsvData(input: $input) {
      newTeacherCount
      newCohortCount
    }
  }
`;

type Props = {
  engagementId: string;
  disabled: boolean;
  processedCsv: ProcessedCohort[] | null;
};
export function StepFourSubmit({
  engagementId,
  processedCsv,
  disabled,
}: Props) {
  if (disabled) {
    return null;
  }

  if (!processedCsv) {
    return <ErrorBox msg="Unable to find CSV to submit" />;
  }

  return (
    <StepFourSubmitBody
      engagementId={engagementId}
      processedCsv={processedCsv}
    />
  );
}

type StepFourSubmitBodyProps = {
  engagementId: string;
  processedCsv: ProcessedCohort[];
};

export function StepFourSubmitBody({
  engagementId,
  processedCsv,
}: StepFourSubmitBodyProps) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [creationCounts, setCreationCounts] = useState<
    { newTeacherCount: number; newCohortCount: number } | undefined
  >();

  const [saveCsvData, { loading }] = useMutation<SaveCohortsCsvDataMutation>(
    SAVE_COHORTS_CSV_DATA,
    {
      onError: (err: ApolloError) => setErrorMsg(err.message),
      onCompleted: ({ saveCohortsCsvData }) => {
        setCreationCounts({
          newTeacherCount: saveCohortsCsvData.newTeacherCount,
          newCohortCount: saveCohortsCsvData.newCohortCount,
        });
      },
      refetchQueries: [CSV_UPLOAD_PAGE_QUERY_NAME],
      onQueryUpdated(observableQuery) {
        observableQuery.refetch();
      },
    }
  );

  const onSaveData = async () => {
    await saveCsvData({
      variables: {
        input: { engagementId, cohorts: processedCsv },
      },
    });
  };

  return (
    <div className="flex flex-col">
      <div className="flex my-4 items-center">
        <Button
          theme="tertiary"
          className="flex items-center"
          disabled={errorMsg !== null || creationCounts != null}
          onClick={() => onSaveData()}
        >
          <CheckCircleIcon className="w-6 h-6 text-green-600" />
          <span className="ml-3">Submit</span>
        </Button>
        <div className="ml-4">
          {loading ? (
            <div className="">
              <Spinner color="border-blue-500" />
            </div>
          ) : creationCounts ? (
            <div>
              <div className="text-sm text-green-600">Upload complete!</div>
              <div>
                <span className="text-sm text-gray-500">
                  New cohorts:{creationCounts.newCohortCount}
                </span>
                <span className="text-sm text-gray-500 ml-4">
                  New teachers:{creationCounts.newTeacherCount}
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      {errorMsg && (
        <div className="mt-4">
          <ErrorBox msg={errorMsg} />
        </div>
      )}
    </div>
  );
}
