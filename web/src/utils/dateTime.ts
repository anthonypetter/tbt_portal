import startOfWeek from "date-fns/startOfWeek";
import formatISO from "date-fns/formatISO";

export type WeekdayNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type Weekday =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

export const weekdays: Weekday[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export type LocalizedWeekday = {
  long: string;
  short: string;
  narrow: string;
  isoDateTime: string;
};

export const TimeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;

/**
 * Uses Intl.DateTimeFormat() to create a list of weekday titles that will match
 * the language and locale of the client.
 * Returns seven days of the week, always with Sunday as the first entry.
 *
 * For reference:
 * * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param targetDate Leave empty for the current time.
 * @param locales Leave empty for client's locale. See Intl documentation.
 * @returns
 */
export function localizedWeekdays(
  targetDate = new Date(),
  locales: string[] | string = []
): LocalizedWeekday[] {
  // Get the midnight of the given dateTime to set the calendar's days correctly.
  const targetDateMidnight = new Date(targetDate.setHours(0, 0, 0, 0));
  const workingDate = startOfWeek(targetDateMidnight); // Gets Sunday of target date's week.

  const localizedWeekdays = [];

  const longFormat = new Intl.DateTimeFormat(locales, { weekday: "long" });
  const shortFormat = new Intl.DateTimeFormat(locales, { weekday: "short" });
  const narrowFormat = new Intl.DateTimeFormat(locales, { weekday: "narrow" });

  for (let d = 0; d < 7; ++d) {
    localizedWeekdays.push({
      long: longFormat.format(workingDate),
      short: shortFormat.format(workingDate),
      narrow: narrowFormat.format(workingDate),
      isoDateTime: formatISO(workingDate),
    });
    workingDate.setDate(workingDate.getDate() + 1); // Increment one day.
  }

  return localizedWeekdays;
}

/**
 * When you have the option to change the start day of a week it's important to
 * be able to smoothly adjust and find the newly adjusted index for any day you
 * need.
 * Ex 1: If the start day of the week is Sunday (0)... [S M T W T F S]
 *  Then Sunday will be at index 0. Monday will be at index 1.
 * Ex 2: If the start day of the week is Monday (1)... [M T W T F S S]
 *  Then Sunday will be at index 6. Monday will be at index 0.
 * Ex 3: if the start of the week is Saturday (6)... [S S M T W T F]
 *  Then Sunday will be at index 1. Monday will be at index 2.
 * @param weekday
 * @param startDay
 * @returns
 */
export function findWeekdayNumberOffset(
  weekday: Weekday,
  startDay: WeekdayNumber
): WeekdayNumber {
  const dayIndex = weekdays.indexOf(weekday);
  if (dayIndex < 0) {
    return 0; // Bad weekday. Weird failure in type checking happened.
  } else {
    return ((weekdays.indexOf(weekday) + 7 - startDay) % 7) as WeekdayNumber;
  }
}
