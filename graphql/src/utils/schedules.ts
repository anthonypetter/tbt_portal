import { Weekday } from "@prisma/client";
import { AssignmentSubject } from "../schema/__generated__/graphql";
import { CsvCohortInput, SubjectScheduleInput } from "../services/cohort";
import { Time } from "./dateTime";

export type ScheduleEntry = {
  weekday: Weekday;
  subject: AssignmentSubject;
  startTime: Time;
  endTime: Time;
  timeZone: string;
};

export function extractSchedules(cohort: CsvCohortInput) {
  const mondaySchedules = cohort.monday.map((subjectSchedule) =>
    extractWeekdaySchedule(Weekday.MONDAY, subjectSchedule)
  );
  const tuesdaySchedules = cohort.tuesday.map((subjectSchedule) =>
    extractWeekdaySchedule(Weekday.TUESDAY, subjectSchedule)
  );
  const wednesdaySchedules = cohort.wednesday.map((subjectSchedule) =>
    extractWeekdaySchedule(Weekday.WEDNESDAY, subjectSchedule)
  );
  const thursdaySchedules = cohort.thursday.map((subjectSchedule) =>
    extractWeekdaySchedule(Weekday.THURSDAY, subjectSchedule)
  );
  const fridaySchedules = cohort.friday.map((subjectSchedule) =>
    extractWeekdaySchedule(Weekday.FRIDAY, subjectSchedule)
  );
  const saturdaySchedules = cohort.saturday.map((subjectSchedule) =>
    extractWeekdaySchedule(Weekday.SATURDAY, subjectSchedule)
  );
  const sundaySchedules = cohort.sunday.map((subjectSchedule) =>
    extractWeekdaySchedule(Weekday.SUNDAY, subjectSchedule)
  );

  return [
    ...mondaySchedules,
    ...tuesdaySchedules,
    ...wednesdaySchedules,
    ...thursdaySchedules,
    ...fridaySchedules,
    ...saturdaySchedules,
    ...sundaySchedules,
  ];
}

function extractWeekdaySchedule(
  weekday: Weekday,
  subjectSchedule: SubjectScheduleInput
): ScheduleEntry {
  return {
    weekday,
    subject: subjectSchedule.subject,
    startTime: subjectSchedule.startTime,
    endTime: subjectSchedule.endTime,
    timeZone: subjectSchedule.timeZone,
  };
}
