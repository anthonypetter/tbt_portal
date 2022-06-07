import startOfWeek from "date-fns/startOfWeek";
import formatISO from "date-fns/formatISO";

export type WeekdayNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type LocalizedWeekday = {
  long: string;
  short: string;
  narrow: string;
  isoDate: string;
};

/**
 * Uses Intl.DateTimeFormat() to create a list of weekday titles that will match
 * the language and locale of the client.
 * Returns seven days of the week, always with Sunday as the first entry.
 *
 * For reference:
 * * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param targetDate Leave empty for today's date.
 * @param locales Leave empty for client's locale. See Intl documentation.
 * @returns
 */
export function localizedWeekdays(
  targetDate = new Date(), // Leave empty for today's date.
  locales: string[] | string = [] // Leave empty for the client's locale.
): LocalizedWeekday[] {
  const date = startOfWeek(targetDate); // Gets Sunday of target date's week.
  const localizedWeekdays = [];
  const long = new Intl.DateTimeFormat(locales, { weekday: "long" });
  const short = new Intl.DateTimeFormat(locales, { weekday: "short" });
  const narrow = new Intl.DateTimeFormat(locales, { weekday: "narrow" });

  for (let d = 0; d < 7; ++d) {
    localizedWeekdays.push({
      long: long.format(date),
      short: short.format(date),
      narrow: narrow.format(date),
      isoDate: formatISO(date, { representation: "date" }),
    });
    date.setDate(date.getDate() + 1);
  }

  return localizedWeekdays;
}
