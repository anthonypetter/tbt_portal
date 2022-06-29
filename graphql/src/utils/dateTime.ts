export enum Weekday {
  SUNDAY,
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
}

/**
 * Given a particular dateTime this will return the same dateTime but with the
 * time set to midnight (00:00:00), UTC.
 *
 * For example: given a dateTime of 2022-06-20 @ 23:00 ET this function will
 * disregard that time and instead only pay attention to the calendar date.
 * Thus, it will return 2022-06-20 @ 00:00 midnight UTC (which is
 * 2022-06-19 @ 20:00 ET).
 *
 * Since our DB, for some fields, is storing only the date (yyyy-MM-dd) we need
 * to make sure that our internal dateTimes adhere to this midnight UTC date
 * format. Node forces us to deal with dateTime instead of just, say, strings
 * reading "2022-06-20".
 *
 * This is important for cases such as determining, in a query, events that
 * happen after/before/on a certain date, while our server code only works with
 * dateTime objects which carry with them data on their time zone.
 *
 * IMPORTANT - DO NOT USE WITH TIME-SENSITIVE SITUATIONS:
 * This function can very easily lead to confusing query results if used in
 * situations where you need the TIME and not just the DATE.
 * For example, if a person in the ET time zone is looking for classes that took
 * place between midnight June 10th and midnight June 21th, they will not see
 * classes that happened past 8pm ET on June 20th, as that will be midnight
 * June 21st UTC. In that case, you should consider working with local dateTimes
 * from the client in their queries.
 * @param dateTime
 * @returns
 */
export function normalizeDateTimeToUTCDate(dateTime: Date): Date {
  // Hours, minutes, seconds, milliseconds are left at 0.
  return new Date(
    Date.UTC(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate())
  );
}

/**
 * Takes a Date and Time and creates a Floating DateTime. Floating dateTime
 * represents a "local" time that can later be converted to an incremental
 * time by applying a time zone.
 *
 * Info on floating times:
 *  - https://www.w3.org/International/wiki/FloatingTime
 *  - https://github.com/jakubroztocil/rrule#important-use-utc-dates
 *
 *
 */

export type Hour = number;
export type Minute = number;

export type Time = {
  hour: Hour;
  minute: Minute;
};

export function makeFloatingDateTime({
  date,
  time,
}: {
  date: Date;
  time: Time;
}) {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      time.hour,
      time.minute
    )
  );
}

/**
 * Takes time object and converts it to a normalized time string
 */

export type Time24Hour = string;

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
