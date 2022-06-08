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
 * @param targetDate yyyy-MM-dd date string of any date within the desired week.
 * @param locales Leave empty for client's locale. See Intl documentation.
 * @returns
 */
export function localizedWeekdays(
  targetDate: string,
  locales: string[] | string = []
): LocalizedWeekday[] {
  const parsedTargetDate = new Date(`${targetDate}T00:00:00`);

  // Get the midnight of the given dateTime to set the calendar's days correctly.
  const targetDateMidnight = new Date(parsedTargetDate.setHours(0, 0, 0, 0));
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
 * Simple helper function takes a weekday name (ex: "monday") and returns
 * the weekday number (ex: 1) in a safe manner.
 * @param weekday
 * @returns
 */
export function findWeekdayNumber(weekday: Weekday): WeekdayNumber {
  const dayIndex = weekdays.indexOf(weekday);
  return dayIndex < 0 ? 0 : (dayIndex as WeekdayNumber);
}
