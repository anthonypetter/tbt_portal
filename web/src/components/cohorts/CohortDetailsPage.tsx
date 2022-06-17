import { gql } from "@apollo/client";
import { CohortDetailsFragment } from "@generated/graphql";
import { breadcrumbs } from "@utils/breadcrumbs";
import { Routes } from "@utils/routes";
import { AssignmentSubjectBadge } from "components/AssignmentSubjectBadge";
import { Container } from "components/Container";
import { DateText } from "components/Date";
import { DetailsAside } from "components/DetailsAside";
import { Link } from "components/Link";
import { PageHeader } from "../PageHeader";

CohortDetailsPage.fragments = {
  cohort: gql`
    fragment CohortDetails on Cohort {
      id
      createdAt
      name
      grade
      meetingRoom
      hostKey
      meetingId
      startDate
      endDate
      engagement {
        id
        name
        startDate
        endDate
        organization {
          id
          name
        }
      }
      schedule {
        createdAt
        weekday
        subject
        startTime
        endTime
        timeZone
      }
      staffAssignments {
        user {
          id
          fullName
          email
        }
        subject
      }
    }
  `,
};

type Props = {
  cohort: NonNullable<CohortDetailsFragment>;
};

export function CohortDetailsPage({ cohort }: Props) {
  return (
    <>
      <PageHeader
        title="Cohort"
        breadcrumbs={[
          breadcrumbs.home(),
          { name: "Cohorts", href: Routes.cohorts.href() },
          {
            name: cohort.name,
            href: Routes.cohortDetail.href(cohort.id),
            current: true,
          },
        ]}
      />
      <Container>
        <div className="min-h-full">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <DetailsAside.Section title={cohort.name}>
                <DetailsAside.Line
                  label="Starts"
                  value={<DateText timeMs={cohort.startDate} />}
                />
                <DetailsAside.Line
                  label="Ends"
                  value={<DateText timeMs={cohort.endDate} />}
                />
                <DetailsAside.Line label="Grade" value={cohort.grade} />
                <DetailsAside.Line
                  label="Meeting Room"
                  value={
                    cohort.meetingRoom ? (
                      <div>
                        <Link href={cohort.meetingRoom}>
                          <p className="text-ellipsis text-blue-400 truncate">
                            Backdoor Link
                          </p>
                        </Link>

                        <Link href={Routes.cohortRoom.href(cohort.id, "host")}>
                          <p className="text-ellipsis text-blue-400 truncate">
                            Host Link
                          </p>
                        </Link>
                        <Link
                          href={Routes.cohortRoom.href(cohort.id, "student")}
                        >
                          <p className="text-ellipsis text-blue-400 truncate">
                            Student Link
                          </p>
                        </Link>
                      </div>
                    ) : (
                      ""
                    )
                  }
                />
                <DetailsAside.Line label="Host Key" value={cohort.hostKey} />
                <DetailsAside.Line
                  label="Created At"
                  value={<DateText timeMs={cohort.createdAt} />}
                />
              </DetailsAside.Section>
            </div>
            <div>
              <DetailsAside.Section title="Staff Assignment">
                {cohort.staffAssignments.length === 0 ? (
                  <p className="py-2 text-sm font-medium text-gray-500 italic">
                    Teachers not yet assigned.
                  </p>
                ) : (
                  cohort.staffAssignments.map((assignment) => (
                    <DetailsAside.Line
                      key={`${assignment.user.id}-${assignment.subject}`}
                      label={assignment.user.fullName}
                      value={
                        <AssignmentSubjectBadge subject={assignment.subject} />
                      }
                    />
                  ))
                )}
              </DetailsAside.Section>
            </div>
            <div>
              <DetailsAside.Section title="Schedule">
                <></>
              </DetailsAside.Section>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
