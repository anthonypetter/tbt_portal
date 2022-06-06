import { CohortMockSchedule } from "@generated/graphql"
import { WeekCalendar } from "./WeekCalendar";

type CohortsScheduleCalendarProps = {
  //////////// MOCK Schedule data for this Cohort ////////////
  cohorts: CohortMockSchedule[],  // Multiple cohorts with schedule data
};

export function CohortsScheduleCalendar({ cohorts }: CohortsScheduleCalendarProps) {
  return (
    <WeekCalendar />
  );
}
