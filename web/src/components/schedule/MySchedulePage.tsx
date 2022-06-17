import { MySchedulePageQuery } from "@generated/graphql";
import { breadcrumbs } from "@utils/breadcrumbs";
import { CohortsScheduleCalendar } from "components/cohorts/scheduleCalendar/CohortsScheduleCalendar";
import { PageHeader } from "components/PageHeader";

type Props = {
  cohorts: NonNullable<MySchedulePageQuery["teacherCohorts"]>;
}
export function MySchedulePage({ cohorts }: Props) {
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
          />
      </div>
    </div>
  );
}
