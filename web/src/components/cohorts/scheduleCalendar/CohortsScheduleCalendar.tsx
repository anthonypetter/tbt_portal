import { gql } from "@apollo/client";
import formatISO from "date-fns/formatISO";

import { CohortForScheduleCalendarFragment } from "@generated/graphql";
import { WeekCalendar, WeekCalendarEvent } from "./WeekCalendar";

CohortsScheduleCalendar.fragments = {
  cohort: gql`
    fragment CohortForScheduleCalendar on Cohort {
      name
      grade
      startDate
      endDate
      schedule {
        weekday
        subject
        startTime
        endTime
        timeZone
      }
    }
  `
};

type CohortsScheduleCalendarProps = {
  cohorts: CohortForScheduleCalendarFragment[],  // Multiple cohorts with schedule data
};

export function CohortsScheduleCalendar({ cohorts }: CohortsScheduleCalendarProps) {
  const weekCalendarSchedule = buildWeekCalendarSchedule(cohorts);

  return (
    <WeekCalendar
      events={weekCalendarSchedule}
      targetDate={formatISO(new Date(), { representation: "date" })}
      locale={Intl.NumberFormat().resolvedOptions().locale}
      // locale="ja-JP" // Good for testing: Shows how flexible the locale can be
      viewingTimeZone={Intl.DateTimeFormat().resolvedOptions().timeZone}
      // viewingTimeZone="Asia/Tokyo" // Good for testing: Often the next day
      mode24Hour={false}
    />
  );
}

function buildWeekCalendarSchedule(cohorts: CohortForScheduleCalendarFragment[]): WeekCalendarEvent[] {
  const weekCalendarEvents: WeekCalendarEvent[] = [];

  cohorts.forEach((cohort, i) => {
    cohort.schedule.forEach(day => {
      weekCalendarEvents.push({
        weekday: day.weekday,
        timeZone: day.timeZone,
        startTime: day.startTime,
        endTime: day.endTime,
        startDate: cohort.startDate,
        endDate: cohort.endDate,
        groupKey: `${i}+${day.subject}`,
        title: `${cohort.grade && cohort.grade + ": "}${day.subject}`,
        details: `${cohort.name}`,
      })
    });
  });

  return weekCalendarEvents;
}
