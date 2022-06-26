import { gql } from "@apollo/client";
import { CohortForCohortsScheduleCalendarFragment } from "@generated/graphql";
import { breadcrumbs } from "@utils/breadcrumbs";
import {
  CohortsScheduleCalendar,
  TargetUserIds,
} from "components/cohorts/scheduleCalendar/CohortsScheduleCalendar";
import { PageHeader } from "components/PageHeader";

MySchedulePage.fragments = {
  query: gql`
    fragment CurrentUserQueryForMySchedulePage on Query {
      currentUser {
        id
      }
      teacherCohorts {
        ...CohortForCohortsScheduleCalendar
      }
    }
    ${CohortsScheduleCalendar.fragments.cohort}
  `,
};

type Props = {
  cohorts: CohortForCohortsScheduleCalendarFragment[];
  targetUserIds?: TargetUserIds;
};

export function MySchedulePage({ cohorts, targetUserIds = [] }: Props) {
  return (
    // Want better height definition than this but I couldn't figure one out.
    <div className="h-[calc(100vh-15rem)]">
      <PageHeader
        title="My Schedule"
        breadcrumbs={[
          breadcrumbs.home(),
          breadcrumbs.mySchedule({ current: true }),
        ]}
      />
      <div className="h-full px-4 py-2 bg-white rounded-md">
        <CohortsScheduleCalendar
          cohorts={cohorts}
          targetUserIds={targetUserIds}
        />
      </div>
    </div>
  );
}
