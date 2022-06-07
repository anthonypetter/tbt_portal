import random from "lodash/random";

import { Cohort } from "@generated/graphql";
import { WeekCalendar, WeekCalendarEvent } from "./WeekCalendar";
import { Weekday } from "@utils/dateTime";

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

// HEAVY MOCKING ZONE! SUBJECT TO CHANGE WHEN BACKEND IS COMPLETE! //
function buildWeekCalendarSchedule(cohorts: Cohort[]): WeekCalendarEvent[] {
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
      title: `${randomSubject}${cohort.grade && " ("+ cohort.grade +")"}`,
      details: `${cohort.name} (${randomTimeZone})`,
      groupId: i,
    };
    const eventB: WeekCalendarEvent = {
      weekday: randomDayB,
      startTime: startTimeB,
      endTime: endTimeB,
      timeZone: randomTimeZone,
      title: `${randomSubject}${cohort.grade && " (Grade "+ cohort.grade +")"}`,
      details: `${cohort.name} (${randomTimeZone})`,
      groupId: i,
    };
    weekCalendarEvents.push(eventA, eventB);
  });

  return weekCalendarEvents;
}