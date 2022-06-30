import { AssignmentSubject } from "@generated/graphql";
import { normalizeDateTimeToUTCDate, Weekday } from "../dateTime";
import { calculateRecurringEvents } from "../recurrence";

describe("recurrence", () => {
  test("should calculate expected recurring events given a set of schedules for multiple subjects", () => {
    const schedules = [
      {
        weekday: Weekday.MONDAY,
        subject: AssignmentSubject.General,
        startTime: { hour: 13, minute: 0 },
        endTime: { hour: 14, minute: 7 },
        timeZone: "America/Los_Angeles",
      },
      {
        weekday: Weekday.TUESDAY,
        subject: AssignmentSubject.Ela,
        startTime: { hour: 8, minute: 30 },
        endTime: { hour: 9, minute: 45 },
        timeZone: "America/Los_Angeles",
      },
      {
        weekday: Weekday.TUESDAY,
        subject: AssignmentSubject.Math,
        startTime: { hour: 10, minute: 0 },
        endTime: { hour: 11, minute: 0 },
        timeZone: "America/Los_Angeles",
      },
      {
        weekday: Weekday.WEDNESDAY,
        subject: AssignmentSubject.General,
        startTime: { hour: 13, minute: 0 },
        endTime: { hour: 14, minute: 7 },
        timeZone: "America/Los_Angeles",
      },
      {
        weekday: Weekday.THURSDAY,
        subject: AssignmentSubject.Ela,
        startTime: { hour: 8, minute: 30 },
        endTime: { hour: 9, minute: 45 },
        timeZone: "America/Los_Angeles",
      },
      {
        weekday: Weekday.THURSDAY,
        subject: AssignmentSubject.Math,
        startTime: { hour: 15, minute: 0 },
        endTime: { hour: 16, minute: 15 },
        timeZone: "America/Los_Angeles",
      },
      {
        weekday: Weekday.FRIDAY,
        subject: AssignmentSubject.General,
        startTime: { hour: 13, minute: 0 },
        endTime: { hour: 14, minute: 7 },
        timeZone: "America/Los_Angeles",
      },
    ];

    const startDate = normalizeDateTimeToUTCDate(new Date("6/27/2022"));
    const endDate = normalizeDateTimeToUTCDate(new Date("12/27/2022"));

    const expected = [
      {
        eventType: "RECURRING",
        meetingType: "STUDENT_SESSION",
        subject: "GENERAL",
        startDateTime: new Date("2022-06-27T13:00:00.000Z"),
        timeZone: "America/Los_Angeles",
        durationMinutes: 67,
        recurrenceRule:
          "DTSTART:20220627T130000Z\n" +
          "RRULE:FREQ=DAILY;BYDAY=MO,WE,FR;UNTIL=20221227T235900Z",
      },
      {
        eventType: "RECURRING",
        meetingType: "STUDENT_SESSION",
        subject: "ELA",
        startDateTime: new Date("2022-06-27T08:30:00.000Z"),
        timeZone: "America/Los_Angeles",
        durationMinutes: 75,
        recurrenceRule:
          "DTSTART:20220627T083000Z\n" +
          "RRULE:FREQ=DAILY;BYDAY=TU,TH;UNTIL=20221227T235900Z",
      },
      {
        eventType: "RECURRING",
        meetingType: "STUDENT_SESSION",
        subject: "MATH",
        startDateTime: new Date("2022-06-27T10:00:00.000Z"),
        timeZone: "America/Los_Angeles",
        durationMinutes: 60,
        recurrenceRule:
          "DTSTART:20220627T100000Z\n" +
          "RRULE:FREQ=DAILY;BYDAY=TU;UNTIL=20221227T235900Z",
      },
      {
        eventType: "RECURRING",
        meetingType: "STUDENT_SESSION",
        subject: "MATH",
        startDateTime: new Date("2022-06-27T15:00:00.000Z"),
        timeZone: "America/Los_Angeles",
        durationMinutes: 75,
        recurrenceRule:
          "DTSTART:20220627T150000Z\n" +
          "RRULE:FREQ=DAILY;BYDAY=TH;UNTIL=20221227T235900Z",
      },
    ];

    const results = calculateRecurringEvents({ startDate, endDate, schedules });
    expect(results).toEqual(expected);
  });

  test("should calculate expected recurring events given a set of schedules for a single subject", () => {
    const schedules = [
      {
        weekday: Weekday.MONDAY,
        subject: AssignmentSubject.Math,
        startTime: { hour: 10, minute: 0 },
        endTime: { hour: 12, minute: 0 },
        timeZone: "America/New_York",
      },
      {
        weekday: Weekday.WEDNESDAY,
        subject: AssignmentSubject.Math,
        startTime: { hour: 15, minute: 0 },
        endTime: { hour: 16, minute: 37 },
        timeZone: "America/New_York",
      },
      {
        weekday: Weekday.THURSDAY,
        subject: AssignmentSubject.Math,
        startTime: { hour: 10, minute: 0 },
        endTime: { hour: 12, minute: 0 },
        timeZone: "America/New_York",
      },
    ];

    const startDate = normalizeDateTimeToUTCDate(new Date("7/1/2022"));
    const endDate = normalizeDateTimeToUTCDate(new Date("7/30/2022"));

    const expected = [
      {
        eventType: "RECURRING",
        meetingType: "STUDENT_SESSION",
        subject: "MATH",
        startDateTime: new Date("2022-07-01T10:00:00.000Z"),
        timeZone: "America/New_York",
        durationMinutes: 120,
        recurrenceRule:
          "DTSTART:20220701T100000Z\n" +
          "RRULE:FREQ=DAILY;BYDAY=MO,TH;UNTIL=20220730T235900Z",
      },
      {
        eventType: "RECURRING",
        meetingType: "STUDENT_SESSION",
        subject: "MATH",
        startDateTime: new Date("2022-07-01T15:00:00.000Z"),
        timeZone: "America/New_York",
        durationMinutes: 97,
        recurrenceRule:
          "DTSTART:20220701T150000Z\n" +
          "RRULE:FREQ=DAILY;BYDAY=WE;UNTIL=20220730T235900Z",
      },
    ];

    const results = calculateRecurringEvents({ startDate, endDate, schedules });
    expect(results).toEqual(expected);
  });

  test("should calculate expected recurring events given a set of schedules for a multiple subjects on a single weekday.", () => {
    const schedules = [
      {
        weekday: Weekday.MONDAY,
        subject: AssignmentSubject.General,
        startTime: { hour: 7, minute: 13 },
        endTime: { hour: 8, minute: 21 },
        timeZone: "America/Denver",
      },
      {
        weekday: Weekday.MONDAY,
        subject: AssignmentSubject.General,
        startTime: { hour: 12, minute: 36 },
        endTime: { hour: 13, minute: 20 },
        timeZone: "America/Denver",
      },
      {
        weekday: Weekday.MONDAY,
        subject: AssignmentSubject.Ela,
        startTime: { hour: 16, minute: 15 },
        endTime: { hour: 17, minute: 3 },
        timeZone: "America/Denver",
      },
    ];

    const startDate = normalizeDateTimeToUTCDate(new Date("1/1/2023"));
    const endDate = normalizeDateTimeToUTCDate(new Date("1/5/2023"));

    const expected = [
      {
        eventType: "RECURRING",
        meetingType: "STUDENT_SESSION",
        subject: "GENERAL",
        startDateTime: new Date("2023-01-01T07:13:00.000Z"),
        timeZone: "America/Denver",
        durationMinutes: 68,
        recurrenceRule:
          "DTSTART:20230101T071300Z\n" +
          "RRULE:FREQ=DAILY;BYDAY=MO;UNTIL=20230105T235900Z",
      },
      {
        eventType: "RECURRING",
        meetingType: "STUDENT_SESSION",
        subject: "GENERAL",
        startDateTime: new Date("2023-01-01T12:36:00.000Z"),
        timeZone: "America/Denver",
        durationMinutes: 44,
        recurrenceRule:
          "DTSTART:20230101T123600Z\n" +
          "RRULE:FREQ=DAILY;BYDAY=MO;UNTIL=20230105T235900Z",
      },
      {
        eventType: "RECURRING",
        meetingType: "STUDENT_SESSION",
        subject: "ELA",
        startDateTime: new Date("2023-01-01T16:15:00.000Z"),
        timeZone: "America/Denver",
        durationMinutes: 48,
        recurrenceRule:
          "DTSTART:20230101T161500Z\n" +
          "RRULE:FREQ=DAILY;BYDAY=MO;UNTIL=20230105T235900Z",
      },
    ];

    const results = calculateRecurringEvents({ startDate, endDate, schedules });
    expect(results).toEqual(expected);
  });

  test("should return empty if schedules are not provided", () => {
    const startDate = normalizeDateTimeToUTCDate(new Date("6/27/2022"));
    const endDate = normalizeDateTimeToUTCDate(new Date("12/27/2022"));

    const results = calculateRecurringEvents({
      startDate,
      endDate,
      schedules: [],
    });
    expect(results).toEqual([]);
  });
});
