import { MySchedulePageQuery } from "@generated/graphql";
import { breadcrumbs } from "@utils/breadcrumbs";
import { CohortsScheduleCalendar } from "components/cohorts/scheduleCalendar/CohortsScheduleCalendar";
import { PageHeader } from "components/PageHeader";

type Props = {
  cohorts: NonNullable<MySchedulePageQuery["teacherCohorts"]>;
}
export function MySchedulePage({ cohorts }: Props) {
  return (
    <div>
      <PageHeader
        title="My Schedule"
        breadcrumbs={[
          breadcrumbs.home(),
          breadcrumbs.mySchedule({ current: true }),
        ]}
      />
      <div className="mb-4 lg:mb-0 p-6 rounded-md bg-gray-200">
        <CohortsScheduleCalendar
          cohorts={cohorts}
        />
      </div>
    </div>
  )
}