import { normalizeDateFromUTCDateTime } from "@utils/dateTime";
import React from "react";

type Props = {
  timeMs: number | null | undefined;
};

export function NormalizedDateText({ timeMs }: Props) {
  if (!timeMs) {
    return <span>&#8212;</span>;
  }

  /**
   * Start and end dates are stored in the DB as dates with no time.
   * Javascript will interpret these dates as DateTimes with time 00:00:00 UTC
   *
   * When instantiated in the date constructor, Javascript will convert the given date to
   * your local timezone. And since the west is behind UTC by several hours, UTC midnight
   * is always still the previous day for us. Example: In New York (UTC-4),
   * 8/1/2022 00:00:00 UTC will be converted to 7/31/2022 19:00:00
   *
   * JS is trying to do the right thing. It's trying to represent that exact moment in
   * time correctly in all timezones.
   *
   * For the purposes of this UI, we are insterested in dates, not times.
   * Let's extract the date and prevent conversion to local time.
   *
   */

  const date = normalizeDateFromUTCDateTime(new Date(timeMs));

  return <span>{date.toLocaleDateString()}</span>;
}
