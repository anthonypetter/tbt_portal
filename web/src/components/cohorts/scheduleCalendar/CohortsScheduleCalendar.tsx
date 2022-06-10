import random from "lodash/random";
import formatISO from "date-fns/formatISO";
import { gql } from "@apollo/client";

import { CohortForScheduleCalendarFragment } from "@generated/graphql";
import { WeekCalendar, WeekCalendarEvent } from "./WeekCalendar";
import { Weekday } from "@utils/dateTime";

CohortsScheduleCalendar.fragments = {
  cohortForScheduleCalendar: gql`
    fragment CohortForScheduleCalendar on Cohort {
      name
      grade
      startDate
      endDate
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

// HEAVY MOCKING ZONE! SUBJECT TO CHANGE WHEN BACKEND IS COMPLETE! //
function buildWeekCalendarSchedule(cohorts: CohortForScheduleCalendarFragment[]): WeekCalendarEvent[] {
  const weekdays: Weekday[] = [
    "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday",
  ];

  const weekCalendarEvents: WeekCalendarEvent[] = [];

  cohorts.forEach((cohort, i) => {
    const randomSubject = ["MATH", "ELA", "GEN"][random(0, 2)];
    const randomTimeZone = [
      "America/Los_Angeles", "America/Denver", "America/Chicago", "America/New_York",
    ][random(0, 3)];

    const randomDayA = weekdays[random(1, 3)];  // Mon/Tue/Wed
    const randomDayB = weekdays[random(4, 5)];  // Thu/Fri

    const randomHourA = random(7, 10);  // Don't want overlaps right now: Earlier
    const randomHourB = random(11, 14); // Later
    const randomMinuteA = random(0, 3) * 15;  // Starts at :00, :15, :30, or :45
    const randomMinuteB = random(0, 3) * 15;
    const randomLengthA = random(2, 6) * 15;  // 30 to 90 minutes long
    const randomLengthB = random(2, 6) * 15;

    const padMinutes = (minutes: number) => String(minutes).padStart(2, "0");

    const startTimeMinutesA = randomHourA * 60 + randomMinuteA;
    const startTimeA = `${Math.floor(startTimeMinutesA / 60)}:${padMinutes(startTimeMinutesA % 60)}`;
    const endTimeMinutesA = startTimeMinutesA + randomLengthA
    const endTimeA = `${Math.floor(endTimeMinutesA / 60)}:${padMinutes(endTimeMinutesA % 60)}`;

    const startTimeMinutesB = randomHourB * 60 + randomMinuteB;
    const startTimeB = `${Math.floor(startTimeMinutesB / 60)}:${padMinutes(startTimeMinutesB % 60)}`;
    const endTimeMinutesB = startTimeMinutesB + randomLengthB;
    const endTimeB = `${Math.floor(endTimeMinutesB / 60)}:${padMinutes(endTimeMinutesB % 60)}`;

    const eventA: WeekCalendarEvent = {
      weekday: randomDayA,
      startTime: startTimeA,
      endTime: endTimeA,
      timeZone: randomTimeZone,
      title: `${cohort.grade && cohort.grade + ": "}${randomSubject}`,
      details: `${cohort.name} (${randomTimeZone})`,
      groupId: i,
      startDate: cohort.startDate,
      endDate: cohort.endDate,
    };
    const eventB: WeekCalendarEvent = {
      weekday: randomDayB,
      startTime: startTimeB,
      endTime: endTimeB,
      timeZone: randomTimeZone,
      title: `${cohort.grade && cohort.grade + ": "}${randomSubject}`,
      details: `${cohort.name} (${randomTimeZone})`,
      groupId: i,
      startDate: cohort.startDate,
      endDate: cohort.endDate,
    };
    weekCalendarEvents.push(eventA, eventB);
  });

  weekCalendarEvents.push({
    weekday: "sunday",
    startTime: "23:00",
    endTime: "23:30",
    timeZone: "America/Los_Angeles",
    title: "Late night #1 in Los Angeles",
    details: "Should go over midnight to Monday",
    groupId: 999,
    startDate: new Date("2022-01-01"),
    endDate: new Date("2032-01-01"),
  });
  weekCalendarEvents.push({
    weekday: "saturday",
    startTime: "20:00",
    endTime: "23:30",
    timeZone: "America/Los_Angeles",
    title: "Late night #2 in Los Angeles",
    details: "Should go over midnight to Sunday next week",
    groupId: 999,
    startDate: new Date("2022-01-01"),
    endDate: new Date("2032-01-01"),
  });
  weekCalendarEvents.push({
    weekday: "monday",
    startTime: "04:00",
    endTime: "05:00",
    timeZone: "America/Los_Angeles",
    title: "4am PT",
    details: "Local Monday",
    groupId: 888,
    startDate: new Date("2022-01-01"),
    endDate: new Date("2032-01-01"),
  });
  weekCalendarEvents.push({
    weekday: "tuesday",
    startTime: "04:00",
    endTime: "05:00",
    timeZone: "America/Denver",
    title: "4am MT",
    details: "Local Tuesday",
    groupId: 888,
    startDate: new Date("2022-01-01"),
    endDate: new Date("2032-01-01"),
  });
  weekCalendarEvents.push({
    weekday: "wednesday",
    startTime: "04:00",
    endTime: "05:00",
    timeZone: "America/Chicago",
    title: "4am CT",
    details: "Local Wednesday",
    groupId: 888,
    startDate: new Date("2022-01-01"),
    endDate: new Date("2032-01-01"),
  });
  weekCalendarEvents.push({
    weekday: "thursday",
    startTime: "04:00",
    endTime: "05:00",
    timeZone: "America/New_York",
    title: "4am ET",
    details: "Local Thursday",
    groupId: 888,
    startDate: new Date("2022-01-01"),
    endDate: new Date("2032-01-01"),
  });
  weekCalendarEvents.push({
    weekday: "thursday",
    startTime: "07:00",
    endTime: "08:49",
    timeZone: "America/New_York",
    title: "",
    details: "",
    groupId: 777,
    startDate: new Date("2022-01-01"),
    endDate: new Date("2032-01-01"),
  });
  weekCalendarEvents.push({
    weekday: "thursday",
    startTime: "10:00",
    endTime: "11:15",
    timeZone: "America/Phoenix",
    title: "Title",
    details: "Details",
    groupId: 777,
    startDate: new Date("2022-01-01"),
    endDate: new Date("2032-01-01"),
  });
  weekCalendarEvents.push({
    weekday: "monday",
    startTime: "10:00",
    endTime: "11:15",
    timeZone: "America/Los_Angeles",
    title: "Extra long title just to show what happens with a long title",
    details: "Details details details. Details are great but too many and it's hard to read!",
    groupId: 787,
    startDate: new Date("2022-01-01"),
    endDate: new Date("2032-01-01"),
  });

  return weekCalendarEvents;
}
