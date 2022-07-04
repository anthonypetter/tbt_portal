import { gql } from "@apollo/client";
import { EngagementDetailsView_EngagementFragment } from "@generated/graphql";
import { Routes } from "@utils/routes";
import { AssignmentRoleBadge } from "components/AssignmentRoleBadge";
import { Details } from "components/Details";
import { ErrorBoundary } from "components/ErrorBoundary";
import { ErrorBox } from "components/ErrorBox";
import { Link } from "components/Link";
import { NormalizedDateText } from "components/NormalizedDateText";

EngagementDetailsView.fragments = {
  engagement: gql`
    fragment EngagementDetailsView_Engagement on Engagement {
      id
      name
      createdAt
      startDate
      endDate
      organization {
        id
        name
      }
      staffAssignments {
        user {
          id
          fullName
        }
        role
      }
    }
  `,
};

type Props = {
  engagement: EngagementDetailsView_EngagementFragment;
};

export function EngagementDetailsView({ engagement }: Props) {
  return (
    <ErrorBoundary fallbackRender={() => <ErrorBox className="mt-4" />}>
      <div className="grid grid-cols-1 sm:grid-cols-2 mt-2">
        <Details className="col-span-1">
          <Details.Line>
            <Details.Term>Engagement ID</Details.Term>
            <Details.Detail>{engagement.id}</Details.Detail>
          </Details.Line>
          <Details.Line>
            <Details.Term>Engagement Name</Details.Term>
            <Details.Detail>{engagement.name}</Details.Detail>
          </Details.Line>
          <Details.Line>
            <Details.Term>Organization</Details.Term>
            <Details.Detail>
              <Link href={Routes.org.details.href(engagement.organization.id)}>
                {engagement.organization.name}
              </Link>
            </Details.Detail>
          </Details.Line>
          <Details.Line>
            <Details.Term>Created</Details.Term>
            <Details.Detail>
              {new Date(engagement.createdAt).toLocaleString()}
            </Details.Detail>
          </Details.Line>
          <Details.Line>
            <Details.Term>Start date</Details.Term>
            <Details.Detail>
              <NormalizedDateText timeMs={engagement.startDate} />
            </Details.Detail>
          </Details.Line>
          <Details.Line>
            <Details.Term>End date</Details.Term>
            <Details.Detail>
              <NormalizedDateText timeMs={engagement.endDate} />
            </Details.Detail>
          </Details.Line>
        </Details>

        <Details className="col-span-1">
          {engagement.staffAssignments.length === 0 ? (
            <p className="py-2 text-sm font-medium text-gray-500 italic">
              Teachers not yet assigned.
            </p>
          ) : (
            engagement.staffAssignments.map((assignment) => {
              return (
                <Details.Line key={`${assignment.user.id}-${assignment.role}`}>
                  <Details.Term>{assignment.user.fullName}</Details.Term>
                  <Details.Detail>
                    <AssignmentRoleBadge role={assignment.role} />
                  </Details.Detail>
                </Details.Line>
              );
            })
          )}
        </Details>
      </div>
    </ErrorBoundary>
  );
}
