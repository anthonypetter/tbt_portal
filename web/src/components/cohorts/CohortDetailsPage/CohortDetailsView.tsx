import { gql } from "@apollo/client";
import { CohortDetailsView_CohortFragment } from "@generated/graphql";
import { ClipboardCopyIcon } from "@heroicons/react/solid";
import { Routes } from "@utils/routes";
import { formatGrade } from "@utils/strings";
import { ErrorBoundary } from "components/ErrorBoundary";
import { ErrorBox } from "components/ErrorBox";
import { Link } from "components/Link";
import { ReactNode } from "react";

CohortDetailsView.fragments = {
  cohort: gql`
    fragment CohortDetailsView_Cohort on Cohort {
      id
      name
      createdAt
      startDate
      endDate
      grade
      meetingRoom
      hostKey
      meetingId
      engagement {
        id
        name
        organization {
          id
          name
        }
      }
    }
  `,
};

type Props = {
  cohort: CohortDetailsView_CohortFragment;
};

export function CohortDetailsView({ cohort }: Props) {
  return (
    <ErrorBoundary fallbackRender={() => <ErrorBox className="mt-4" />}>
      <div className="flex-1 my-4">
        <Details cohort={cohort} />
      </div>
    </ErrorBoundary>
  );
}

function Details({ cohort }: { cohort: CohortDetailsView_CohortFragment }) {
  return (
    <div className="overflow-hidden">
      <DetailLine>
        <DescriptionTerm>Organization</DescriptionTerm>
        <DescriptionDetails>
          <Link
            href={Routes.org.engagements.href(
              cohort.engagement.organization.id
            )}
          >
            {cohort.engagement.organization.name}
          </Link>
        </DescriptionDetails>
      </DetailLine>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <DetailLine>
            <DescriptionTerm>Engagement</DescriptionTerm>
            <DescriptionDetails>
              <Link
                href={Routes.engagement.cohorts.href(
                  cohort.engagement.organization.id,
                  cohort.engagement.id
                )}
              >
                {cohort.engagement.name}
              </Link>
            </DescriptionDetails>
          </DetailLine>
          <DetailLine>
            <DescriptionTerm>Cohort ID</DescriptionTerm>
            <DescriptionDetails>{cohort.id}</DescriptionDetails>
          </DetailLine>
          <DetailLine>
            <DescriptionTerm>Created</DescriptionTerm>
            <DescriptionDetails>
              {new Date(cohort.createdAt).toLocaleString()}
            </DescriptionDetails>
          </DetailLine>
          <DetailLine>
            <DescriptionTerm>Grade</DescriptionTerm>
            <DescriptionDetails>
              {cohort.grade ? formatGrade(cohort.grade) : ""}
            </DescriptionDetails>
          </DetailLine>
          <DetailLine>
            <DescriptionTerm>Host key</DescriptionTerm>
            <DescriptionDetails>
              {cohort.hostKey ? (
                <div className="flex cursor-pointer transition duration-150 ease-in-out">
                  <p>{cohort.hostKey?.slice(0, 30)}...</p>
                  <button
                    className="flex items-center ml-4"
                    data-bs-toggle="tooltip"
                    title="Click here to copy the token"
                    onClick={() =>
                      navigator.clipboard.writeText(cohort.hostKey ?? "")
                    }
                  >
                    <ClipboardCopyIcon className="h-5 w-5 text-gray-500" />
                    <span className="ml-1 text-xs text-gray-500">Copy</span>
                  </button>
                </div>
              ) : (
                "Host key not available"
              )}
            </DescriptionDetails>
          </DetailLine>
          <DetailLine>
            <DescriptionTerm>Backdoor Link</DescriptionTerm>
            <DescriptionDetails>
              {cohort.meetingRoom ? (
                <Link href={cohort.meetingRoom}>
                  <span className="text-ellipsis truncate">Backdoor Link</span>
                </Link>
              ) : (
                "Room has not been created"
              )}
            </DescriptionDetails>
          </DetailLine>

          <DetailLine>
            <DescriptionTerm>Host Link</DescriptionTerm>
            <DescriptionDetails>
              {cohort.meetingRoom ? (
                <Link href={Routes.cohortRoom.href(cohort.id, "host")}>
                  <span className="text-ellipsis truncate">Host Link</span>
                </Link>
              ) : (
                "Room has not been created"
              )}
            </DescriptionDetails>
          </DetailLine>

          <DetailLine>
            <DescriptionTerm>Student Link</DescriptionTerm>
            <DescriptionDetails>
              {cohort.meetingRoom ? (
                <Link href={Routes.cohortRoom.href(cohort.id, "student")}>
                  <span className="text-ellipsis truncate">Student Link</span>
                </Link>
              ) : (
                "Room has not been created"
              )}
            </DescriptionDetails>
          </DetailLine>
        </dl>
      </div>
    </div>
  );
}

function DetailLine({ children }: { children: ReactNode }) {
  return (
    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
      {children}
    </div>
  );
}

function DescriptionTerm({ children }: { children: string }) {
  return <dt className="text-sm font-medium text-gray-500">{children}</dt>;
}

function DescriptionDetails({ children }: { children: ReactNode }) {
  return (
    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
      {children}
    </dd>
  );
}
