/**
 * Given a particular DateTime, this function extracts the DateTime's date and sets
 * hours, minutes, and seconds to 0.
 *
 * Since the DB does not store times for engagement and cohort start/end dates, using
 * a date with no time simplifies date comparisons in database queries.
 */

export function extractDateFromDateTime(originalDateTime: Date) {
  const date = new Date(originalDateTime.getTime());

  const dateNoTime = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  dateNoTime.setUTCHours(0);
  dateNoTime.setUTCMinutes(0);
  dateNoTime.setUTCSeconds(0);

  return dateNoTime;
}
