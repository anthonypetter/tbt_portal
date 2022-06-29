import { AssignmentSubject, EventType, MeetingType } from "@prisma/client";
import groupBy from "lodash/groupBy";
import RRule, { ByWeekday } from "rrule";
import {
  calculateDurationInMinutes,
  makeFloatingDateTime,
  stringifyTime,
  Time,
  Weekday,
} from "./dateTime";
import { ScheduleEntry } from "./schedules";
import { assertUnreachable } from "./types";

export function calculateRecurringEvents({
  startDate,
  endDate,
  schedules,
}: {
  startDate: Date;
  endDate: Date;
  schedules: ScheduleEntry[];
}) {
  /**
   * Step 1 - Group by subject.
   */
  const groupedBySubject = groupBy(schedules, (s) => s.subject);

  /**
   * Step 2. Group all the entries with the same subject by startTime + duration + time zone.
   *
   * If every entry for a subject has the same startTime, endTime, and time zone,
   * then we know this event is recurring with a known pattern.
   */
  const recurrenceBySubject = Object.keys(groupedBySubject).map((subject) => {
    const weekDayEventsForSubject = groupedBySubject[subject];

    const groupedByTime = groupBy(
      weekDayEventsForSubject,
      (entry) =>
        `${stringifyTime(entry.startTime)}-${stringifyTime(entry.endTime)}-${
          entry.timeZone
        }`
    );

    const recurrenceRules = Object.values(groupedByTime).map((weekdayEntry) => {
      const weekdays = weekdayEntry.map((e) => e.weekday);
      // Grabbing the first start/end since they are all the same (they've been grouped)
      const startTime = weekdayEntry[0].startTime;
      const endTime = weekdayEntry[0].endTime;
      const timeZone = weekdayEntry[0].timeZone;
      const durationMinutes = calculateDurationInMinutes(startTime, endTime);

      const recurringEvent = makeRecurringEvent({
        cohortStartDate: startDate,
        cohortEndDate: endDate,
        startTime,
        durationMinutes,
        subject: subject as AssignmentSubject, //lodash lost track of that fact that this is an AssignmentSubject
        byWeekday: weekdays.map((weekday) => toRruleWeekday(weekday)),
        timeZone: timeZone,
      });

      return recurringEvent;
    });

    return { subject, recurrenceRules };
  });

  const recurrenceRules = recurrenceBySubject.flatMap((subjectRules) => {
    return subjectRules.recurrenceRules;
  });

  return recurrenceRules;
}

function makeRecurringEvent({
  cohortStartDate,
  cohortEndDate,
  startTime,
  durationMinutes,
  subject,
  byWeekday,
  timeZone,
}: {
  cohortStartDate: Date;
  cohortEndDate: Date;
  startTime: Time;
  durationMinutes: number;
  subject: AssignmentSubject;
  byWeekday: ByWeekday[];
  timeZone: string;
}) {
  const startDateTime = makeFloatingDateTime({
    date: cohortStartDate,
    time: startTime,
  });

  const endDateTime = makeFloatingDateTime({
    date: cohortEndDate,
    time: { hour: 23, minute: 59 },
  });

  return {
    eventType: EventType.RECURRING,
    meetingType: MeetingType.STUDENT_SESSION,
    subject,

    startDateTime,
    timeZone,
    durationMinutes,

    recurrenceRule: new RRule({
      freq: RRule.DAILY,
      byweekday: byWeekday,
      dtstart: startDateTime,
      until: endDateTime,
    }).toString(),
  };
}

function toRruleWeekday(weekday: Weekday) {
  switch (weekday) {
    case Weekday.SUNDAY:
      return RRule.SU;

    case Weekday.MONDAY:
      return RRule.MO;

    case Weekday.TUESDAY:
      return RRule.TU;

    case Weekday.WEDNESDAY:
      return RRule.WE;

    case Weekday.THURSDAY:
      return RRule.TH;

    case Weekday.FRIDAY:
      return RRule.FR;

    case Weekday.SATURDAY:
      return RRule.SA;

    default:
      assertUnreachable(weekday, "weekday");
  }
}
