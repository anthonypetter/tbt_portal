import startOfWeek from "date-fns/startOfWeek";
import formatISO from "date-fns/formatISO";

/**
 * H:mm or HH:mm time stamp. (ex: 13:05, 6:43, 06:43)
 */
export type Time24Hour = string;
/**
 * IANA Time Zone DB Name.  (ex: "America/New_York")
 */
export type IANAtzName = string;
/**
 * yyyy-MM-dd format date.  (ex: 2022-06-20)
 */
export type ISODate = string;

export type Hour = number;
export type Minute = number;

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
  isoDate: ISODate;
};

export const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;

/**
 * Helper function normalizes time input to be HH:mm when it could be H:mm. In
 * the case of malformed data it will return "00:00".
 * @param timeString
 * @returns
 */
export function normalizeTime(timeString: Time24Hour): Time24Hour {
  const paddedString = timeString.padStart(5, "0"); // 6:30 --> 06:30.
  return timeRegex.test(paddedString) ? paddedString : "00:00";
}

/**
 * Takes a HH:mm or H:mm time string and returns the number of minutes since
 * the start of the day. In the case of malformed data it will return 0.
 * @param timeString
 * @returns
 */
export function calculateMinutesElapsedInDay(timeString: Time24Hour): Minute {
  const [hours, minutes] = normalizeTime(timeString)
    .split(":")
    .map((num) => parseInt(num));
  return hours * 60 + minutes;
}

/**
 * Takes a 24 hour time string (HH:mm/H:mm) and returns a localized version of
 * the 12 hour string (when desired). If mode24Hour is true it simply returns
 * the normalized timeString.
 * @param timeString
 * @param mode24Hour
 * @param locale  Leave empty for client's locale. See Intl documentation.
 * @returns
 */
export function localizedTime(
  timeString: Time24Hour,
  mode24Hour: boolean,
  locale = ""
): string {
  const normalizedTime = normalizeTime(timeString);
  if (mode24Hour) {
    return normalizedTime;
  }
  const iLocale = !locale ? [] : locale;
  const mode12HourFormat = new Intl.DateTimeFormat(iLocale, {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return mode12HourFormat.format(new Date(`2022-01-01T${normalizedTime}`));
}

/**
 * Uses Intl.DateTimeFormat() to create a list of weekday titles that will match
 * the language and locale of the client.
 * Returns seven days of the week, always with Sunday as the first entry.
 * Time zone is not a factor.
 * @param targetDate
 * @param locale Leave empty for client's locale. See Intl documentation.
 * @returns
 */
export function localizedWeekdays(
  targetDate: ISODate,
  locale = ""
): LocalizedWeekday[] {
  const parsedTargetDate = new Date(`${targetDate}T00:00:00`);

  // Get the midnight of the given dateTime to set the calendar's days correctly.
  const targetDateMidnight = new Date(parsedTargetDate.setHours(0, 0, 0, 0));
  const workingDate = startOfWeek(targetDateMidnight); // Gets Sunday of target date's week.

  const localizedWeekdays = [];

  const iLocale = !locale ? [] : locale;
  const longFormat = new Intl.DateTimeFormat(iLocale, { weekday: "long" });
  const shortFormat = new Intl.DateTimeFormat(iLocale, { weekday: "short" });
  const narrowFormat = new Intl.DateTimeFormat(iLocale, { weekday: "narrow" });

  for (let d = 0; d < 7; ++d) {
    localizedWeekdays.push({
      long: longFormat.format(workingDate),
      short: shortFormat.format(workingDate),
      narrow: narrowFormat.format(workingDate),
      isoDate: formatISO(workingDate, { representation: "date" }),
    });
    workingDate.setDate(workingDate.getDate() + 1); // Increment one day.
  }
  return localizedWeekdays;
}

/**
 * Simple helper function takes a weekday name (ex: "monday") and returns
 * the weekday number (ex: 1) in a safe manner.
 * Works with Sunday as the start of the week.
 * @param weekday
 * @returns
 */
export function findWeekdayNumber(weekday: Weekday): WeekdayNumber {
  const dayIndex = weekdays.indexOf(weekday);
  return dayIndex < 0 ? 0 : (dayIndex as WeekdayNumber);
}

/**
 * Give it a number of minutes and it'll return an English, human-readable
 * string.
 *
 * Examples:
 *  * (50, 60) => "50 min"
 *  * (60, 60) => "1 hr"
 *  * (70, 60) => "1 hr 10 min"
 *  * (120, 60) => "2 hrs"
 *  * (121, 60) => "2 hr 1 min"
 * @param minutes
 * @param minimumToHoursCutoff minimum minutes value before printing hours
 * @returns
 */
export function printDuration(
  minutes: Minute,
  minimumToHoursCutoff: Minute
): string {
  if (minutes < minimumToHoursCutoff) {
    return `${minutes} min`;
  }
  const hr = Math.floor(minutes / 60);
  const min = minutes % 60;

  return (
    (hr > 0 ? hr + " hr" : "") +
    (hr > 1 && min === 0 ? "s" : "") +
    (min ? " " + min + " min" : "")
  );
}
