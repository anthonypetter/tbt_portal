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
