import { CohortMockSchedule } from "@generated/graphql"

type CohortsScheduleCalendarProps = {
  //////////// MOCK Schedule data for this Cohort ////////////
  cohorts: CohortMockSchedule[],  // Multiple cohorts with schedule data
};

export function CohortsScheduleCalendar({ cohorts }: CohortsScheduleCalendarProps) {
  return (
    <div className="container mx-auto">
      <h1 className="text-xl2">
        CohortsScheduleCalendar!
      </h1>
      <span className="text-base">I received {cohorts.length} cohort(s)!</span>
    </div>
  );
}
