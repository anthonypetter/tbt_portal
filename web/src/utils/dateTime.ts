import { toDate } from "date-fns-tz";
import formatISO from "date-fns/formatISO";
import startOfWeek from "date-fns/startOfWeek";
import { parseInteger } from "./numbers";

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

export enum Weekday {
  SUNDAY,
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
}

export type WeekdayNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export const weekdaysOrdered: Weekday[] = [
  Weekday.SUNDAY,
  Weekday.MONDAY,
  Weekday.TUESDAY,
  Weekday.WEDNESDAY,
  Weekday.THURSDAY,
  Weekday.FRIDAY,
  Weekday.SATURDAY,
];

export type LocalizedWeekday = {
  long: string;
  short: string;
  narrow: string;
  isoDate: ISODate;
};

export const TIME_REGEX = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;

/**
 * Helper function normalizes time input to be HH:mm when it could be H:mm. In
 * the case of malformed data it will return "00:00".
 * @param timeString
 * @returns
 */
export function normalizeTime(timeString: Time24Hour): Time24Hour {
  const paddedString = timeString.padStart(5, "0"); // 6:30 --> 06:30.
  return TIME_REGEX.test(paddedString) ? paddedString : "00:00";
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
  const dayIndex = weekdaysOrdered.indexOf(weekday);
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

/**
 * Takes a UTC dateTime and assures the returned local dateTime has the same
 * calendar date. As a result, the returned dateTime will be different in terms
 * of literal seconds since the Unix Epoch. But the displayed calendar date will
 * be the same.
 *
 * Takes in a dateTime presumed to be in UTC at midnight (00:00:00). Because the
 * calendar date is the only important piece of data, we must prevent that date
 * from changing due to time zone conversions made by JavaScript.
 *
 * For example, a UTC dateTime of 2022-06-20 at midnight will become
 * 2022-06-19 at 8pm if the client's time zone is in America/New_York. a whole
 * day off despite there only being a 4 hour time zone difference.
 *
 * So, we take the UTC's calendar times and create a new dateTime object with
 * that date in the local timezone.
 *
 * Using that June 20th example, that means, for a user in America/New_York,
 * in will go 2022-06-20T00:00:00Z and out will come 2022-06-20T04:00:00Z.
 * @param utcDateTime
 * @returns new LOCAL dateTime with UTC date's month, day, and year.
 */
export function normalizeDateFromUTCDateTime(utcDateTime: Date): Date {
  // Hours, minutes, seconds, milliseconds are left at 0.
  return new Date(
    utcDateTime.getUTCFullYear(),
    utcDateTime.getUTCMonth(),
    utcDateTime.getUTCDate()
  );
}

/**
 * Takes a DateTime and creates a Zero-offset UTC Date.
 *
 * Example:
 * Input: 2022-06-20T04:00:00Z
 * Output: 2022-06-20T00:00:00Z
 *
 * @param dateTime
 * @returns new UTC zero-offset dateTime with local date's month, day, and year.
 *
 */

export function normalizeToUtcDate(dateTime: Date): Date {
  // Hours, minutes, seconds, milliseconds are left at 0.
  return new Date(
    Date.UTC(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate())
  );
}

/**
 * Takes a floating time and converts it into an incremental time by applying a time zone.
 *
 * Info on floating times:
 *  - https://www.w3.org/International/wiki/FloatingTime
 *  - https://github.com/jakubroztocil/rrule#important-use-utc-dates
 *
 * Info on `toDate`: https://github.com/marnusw/date-fns-tz#todate
 *
 */

export function floatingToZonedDateTime(
  floatingDateTime: Date,
  timeZone: IANAtzName
) {
  const year = floatingDateTime.getFullYear();
  const monthIndex = floatingDateTime.getUTCMonth();
  const day = floatingDateTime.getUTCDate();
  const hour = floatingDateTime.getUTCHours();
  const minute = floatingDateTime.getUTCMinutes();

  const isoStringWithNoOffset = `${formatISO(new Date(year, monthIndex, day), {
    representation: "date",
  })}T${stringifyHour(hour)}:${stringifyMinute(minute)}`;

  return toDate(isoStringWithNoOffset, { timeZone });
}

/**
 * Takes time object and converts it to a normalized time string
 */
export function stringifyTime(time: Time): Time24Hour {
  return `${stringifyHour(time.hour)}:${stringifyMinute(time.minute)}`;
}

function stringifyHour(hour: number) {
  if (hour < 0 || hour > 23) {
    throw new Error(`Invalid hour value encountered: ${hour.toString()}`);
  }
  return hour.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
}

function stringifyMinute(minute: number) {
  if (minute < 0 || minute > 59) {
    throw new Error(`Invalid minute value encountered: ${minute.toString()}`);
  }

  return minute.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
}

/**
 * Takes a timeString and returns an object with the hours and minutes as numbers.
 */

export type Time = {
  hour: Hour;
  minute: Minute;
};

export function numberifyTime(timeString: Time24Hour): Time {
  if (!TIME_REGEX.test(timeString)) {
    throw new Error(
      `Unrecognized time string format: ${
        timeString.length === 0 ? "empty string" : timeString
      }`
    );
  }

  const [hours, minutes] = timeString
    .split(":")
    .map((num) => parseInteger(num));

  return { hour: hours, minute: minutes };
}

/**
 * Calculates number minutes between 2 time objects
 */

export function calculateDurationInMinutes(start: Time, end: Time) {
  const startMinutes = start.hour * 60 + start.minute;
  const endMinutes = end.hour * 60 + end.minute;

  const duration = endMinutes - startMinutes;

  if (duration < 0) {
    throw new Error("Negative durations are not supported.");
  }

  return duration;
}
