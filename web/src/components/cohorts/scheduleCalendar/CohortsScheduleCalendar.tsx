import { Cohort } from "@generated/graphql";
import { WeekCalendar, WeekCalendarEvent } from "./WeekCalendar";

type CohortsScheduleCalendarProps = {
  cohorts: Cohort[],  // Multiple cohorts with schedule data
};

export function CohortsScheduleCalendar({ cohorts }: CohortsScheduleCalendarProps) {
  const weekCalendarSchedule = buildWeekCalendarSchedule(cohorts);

  return (
    <WeekCalendar
      events={weekCalendarSchedule}
      viewingTimezone={Intl.DateTimeFormat().resolvedOptions().timeZone}
      startDay={0}
    />
  );
}

function buildWeekCalendarSchedule(cohorts: Cohort[]): WeekCalendarEvent[] {
  const weekCalendarEvents: WeekCalendarEvent[] = [];

  return weekCalendarEvents;
}
