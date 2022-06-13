/**
 * Given a particular DateTime, this function extract's that DateTime's date
 *
 * The DB does not store times for engagement and cohort start/end dates.
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
