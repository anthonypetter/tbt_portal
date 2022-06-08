import clsx from "clsx";
import toDate from "date-fns-tz/toDate";
import utcToZonedTime from "date-fns-tz/utcToZonedTime";
import format from "date-fns-tz/format";
import { useEffect, useMemo, useRef, useState, Fragment } from "react"

import {
  calculateMinutesElapsedInDay,
  findWeekdayNumber,
  IANAtzName,
  ISODate,
  LocalizedWeekday,
  localizedWeekdays,
  Minute,
  normalizeTime,
  Time24Hour,
  Weekday,
  WeekdayNumber,
} from "@utils/dateTime";

export type WeekCalendarEvent = {
  weekday: Weekday;
  startTime: Time24Hour;  // H:mm - 24 hour format.
  endTime: Time24Hour;    // H:mm - 24 hour format.
  timeZone: IANAtzName;   // IANA time zone name.
  title: string;          // Event title.
  details?: string;       // Event details.
  groupId: number;        // Used to color-coordinate.
  startDate: number;      // Used to filter out events outside the targetDate.
  endDate: number;        // ''
};

type AdjustedWeekCalendarEvent = WeekCalendarEvent & {
  adjustedStartWeekday: Weekday;
  adjustedStartTime: Time24Hour;
  adjustedEndWeekday: Weekday;
  adjustedEndTime: Time24Hour;
  adjustedStartMinute: Minute;
  eventMinuteLength: Minute;
};

type WeekCalendarProps = {
  events: WeekCalendarEvent[];
  targetDate: ISODate;  // Any date whose week will show in the calendar.
  viewingTimeZone: IANAtzName;
};
export function WeekCalendar({ events, targetDate, viewingTimeZone }: WeekCalendarProps) {
  // Get the current time of the viewingTimezone (allows for simulating different time zones).
  const currentViewerTime = utcToZonedTime(new Date(), viewingTimeZone);

  const currentDay = currentViewerTime.getDay() as WeekdayNumber;
  const [selectedDay, setSelectedDay] = useState(currentDay);

  const localizedWeekdaysList = localizedWeekdays(targetDate);

  const container = useRef<HTMLDivElement>(null);
  const containerNav = useRef<HTMLDivElement>(null);
  const containerOffset = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   if (container != null && containerNav != null && containerOffset != null) {
  //     // Set the container scroll position based on the current time.
  //     const currentMinute = new Date().getHours() * 60;
  //     container.current.scrollTop =
  //       ((container.current.scrollHeight -
  //         containerNav.current.offsetHeight -
  //         containerOffset.current.offsetHeight) *
  //         currentMinute) /
  //       1440;
  //       }
  // }, [])

  return (
    <div ref={container} className="h-[70vh] flex flex-auto flex-col overflow-auto bg-white">
      <div className="w-[165%] flex max-w-full flex-none flex-col sm:max-w-none md:max-w-full">
        {/* Days Nav Row */}
        <div
          ref={containerNav}
          className="sticky top-0 z-30 flex-none bg-white shadow ring-1 ring-black ring-opacity-5 sm:pr-8"
        >
          <MobileNav
            localizedWeekdays={localizedWeekdaysList}
            focusedDay={selectedDay}
            onClickDay={(navIndex: number) => setSelectedDay(navIndex as WeekdayNumber)}
          />
          <FullNav
            localizedWeekdays={localizedWeekdaysList}
            focusedDay={currentDay}
          />
        </div>

        {/* Events Grid Section */}
        <div className="flex flex-auto">
          <div className="sticky left-0 z-10 w-14 flex-none bg-white ring-1 ring-gray-100" />
          <div className="grid flex-auto grid-cols-1 grid-rows-1">

            {/* Horizontal lines */}
            <div
              className="col-start-1 col-end-2 row-start-1 grid divide-y divide-gray-100"
              style={{ gridTemplateRows: 'repeat(48, minmax(3.5rem, 1fr))' }}
            >
              <div ref={containerOffset} className="row-end-1 h-7" />
              <HourLines mode24Hour={false} />
            </div>

            {/* Vertical lines */}
            <div className="col-start-1 col-end-2 row-start-1 hidden grid-cols-7 grid-rows-1 divide-x divide-gray-100 sm:grid sm:grid-cols-7">
              <div className="col-start-1 row-span-full" />
              <div className="col-start-2 row-span-full" />
              <div className="col-start-3 row-span-full" />
              <div className="col-start-4 row-span-full" />
              <div className="col-start-5 row-span-full" />
              <div className="col-start-6 row-span-full" />
              <div className="col-start-7 row-span-full" />
              <div className="col-start-8 row-span-full w-8" />
            </div>

            {/* Events */}
            <Events
              localizedWeekdays={localizedWeekdaysList}
              focusedDay={selectedDay}
              events={events}
              viewingTimeZone={viewingTimeZone}
            />
          </div>
        </div>
      </div>
    </div>
  );
}


type HourLinesProps = {
  mode24Hour?: boolean;
};
function HourLines({ mode24Hour = false }: HourLinesProps) {
  const hourLabels = useMemo(
    () => Array(24).fill(0).map((_, h) =>
      mode24Hour ?
        `${String(h).padStart(2, "0")}:00` :
        `${h % 12 ? h % 12 : 12}${h < 12 ? "AM" : "PM"}`,
    ),
    [mode24Hour]);

  return (
    <>
      {hourLabels.map(hour => (
        <Fragment key={hour}>
          <div>
            <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
              {hour}
            </div>
          </div>
          <div />
        </Fragment >
      ))}
    </>
  );
}


type BaseNavProps = {
  localizedWeekdays: LocalizedWeekday[];
  focusedDay: WeekdayNumber;
};

type MobileNavProps = BaseNavProps & {
  onClickDay: (day: WeekdayNumber) => void;
}
function MobileNav({ localizedWeekdays, focusedDay, onClickDay }: MobileNavProps) {
  return (
    <div className="grid grid-cols-7 text-sm leading-6 text-gray-900 sm:hidden">
      {localizedWeekdays.map((weekday, i) => (
        <button
          key={weekday.long}
          type="button"
          className="flex flex-col items-center pt-2 pb-3"
          onClick={() => onClickDay(i as WeekdayNumber)}
        >
          <span
          className={clsx(
            "mt-1 flex h-8 w-8 items-center justify-center font-semibold",
            focusedDay === i && "rounded-full bg-indigo-600 text-white"
          )}>
            {weekday.narrow}
          </span>
        </button>
      ))}
    </div>
  );
}

type FullNavProps = BaseNavProps;
function FullNav({ localizedWeekdays, focusedDay }: FullNavProps) {
  return (
    <div className="-mr-px hidden grid-cols-7 divide-x divide-gray-100 border-r border-gray-100 text-sm leading-6 text-gray-500 sm:grid">
      <div className="col-end-1 w-14" />
      {localizedWeekdays.map((weekday, i) => (
        <div
          key={weekday.long}
          className="flex items-center justify-center py-3 text-gray-900"
        >
          <span className={clsx(
            "items-center justify-center font-semibold ",
            focusedDay === i &&
              "ml-1.5 flex h-8 w-10 rounded-full bg-indigo-600 text-white",
          )}>
            {weekday.short}
          </span>
        </div>
      ))}
    </div>
  );
}


type EventsProps = BaseNavProps & {
  events: WeekCalendarEvent[];
  viewingTimeZone: IANAtzName;
};
function Events({ localizedWeekdays, focusedDay, events, viewingTimeZone }: EventsProps) {
  const adjustedEvents: AdjustedWeekCalendarEvent[] = [];
  events.forEach(event => {
    // Get the local date of the event.
    const eventLocalIsoDate = localizedWeekdays[findWeekdayNumber(event.weekday)].isoDate;

    // Get the local dates of the start+end boundaries of the event.
    const eventLocalStartIsoDate = format(
      event.startDate,
      "yyyy-MM-dd",
      { timeZone: event.timeZone },
    );
    const eventLocalEndIsoDate = format(
      event.endDate,
      "yyyy-MM-dd",
      { timeZone: event.timeZone },
    );

    // Don't show events that have not started or have since ended.
    if (eventLocalIsoDate < eventLocalStartIsoDate ||
      eventLocalIsoDate > eventLocalEndIsoDate) {
      return;
    }

    // Get the Date objects adjusted to the event's given timeZone.
    const eventStartDateTime = toDate(
      `${eventLocalIsoDate}T${normalizeTime(event.startTime)}`,
      { timeZone: event.timeZone },
    );
    const eventEndDateTime = toDate(
      `${eventLocalIsoDate}T${normalizeTime(event.endTime)}`,
      { timeZone: event.timeZone },
    );

    // Don't even bother with events that have start and end times in reverse order
    // or zero length.
    if (eventStartDateTime >= eventEndDateTime) {
      return;
    }

    // Adjust the time/weekday to the viewing timeZone.
    const [adjustedStartWeekday, adjustedStartTime] = format(
      utcToZonedTime(eventStartDateTime, viewingTimeZone),
      'EEEE,HH:mm',
    ).split(",").map(val => val.toLowerCase());
    const [adjustedEndWeekday, adjustedEndTime] = format(
      utcToZonedTime(eventEndDateTime, viewingTimeZone),
      'EEEE,HH:mm',
    ).split(",").map(val => val.toLowerCase());

    const adjustedStartMinute = calculateMinutesElapsedInDay(adjustedStartTime);
    const adjustedEndMinute = calculateMinutesElapsedInDay(adjustedStartTime);

    adjustedEvents.push({
      ...event,
      adjustedStartWeekday: adjustedStartWeekday as Weekday,
      adjustedStartTime,
      adjustedEndWeekday: adjustedEndWeekday as Weekday,
      adjustedEndTime,
      adjustedStartMinute,
      eventMinuteLength: adjustedEndMinute - adjustedStartMinute,
    });
  });

  console.table(adjustedEvents);

  return (
    <ol
      className="col-start-1 col-end-2 row-start-1 grid grid-cols-1 sm:grid-cols-7 sm:pr-8"
      style={{ gridTemplateRows: '1.75rem repeat(288, minmax(0, 1fr)) auto' }}
    >
      <li className="relative mt-px flex sm:col-start-3" style={{ gridRow: '74 / span 12' }}>
        <a
          href="#"
          className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-blue-50 p-2 text-xs leading-5 hover:bg-blue-100"
        >
          <p className="order-1 font-semibold text-blue-700">Breakfast</p>
          <p className="text-blue-500 group-hover:text-blue-700">
            <time dateTime="2022-01-12T06:00">6:00 AM</time>
          </p>
        </a>
      </li>

      <li className="relative mt-px flex sm:col-start-3" style={{ gridRow: '92 / span 30' }}>
        <a
          href="#"
          className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-pink-50 p-2 text-xs leading-5 hover:bg-pink-100"
        >
          <p className="order-1 font-semibold text-pink-700">Flight to Paris</p>
          <p className="text-pink-500 group-hover:text-pink-700">
            <time dateTime="2022-01-12T07:30">7:30 AM</time>
          </p>
        </a>
      </li>

      <li className="relative mt-px hidden sm:col-start-6 sm:flex" style={{ gridRow: '122 / span 24' }}>
        <a
          href="#"
          className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-gray-100 p-2 text-xs leading-5 hover:bg-gray-200"
        >
          <p className="order-1 font-semibold text-gray-700">Meeting with design team at Disney</p>
          <p className="text-gray-500 group-hover:text-gray-700">
            <time dateTime="2022-01-15T10:00">10:00 AM</time>
          </p>
        </a>
      </li>
    </ol>
  );
}


type EventColor = {
  bgClass: string;
  bgHoverClass: string;
  textClass: string;
}
export const EventColors: EventColor[] = [
  { bgClass: "bg-green-50", bgHoverClass: "bg-green-100", textClass: "text-green-700" },
  { bgClass: "bg-yellow-50", bgHoverClass: "bg-yellow-100", textClass: "text-yellow-700" },
  { bgClass: "bg-teal-50", bgHoverClass: "bg-teal-100", textClass: "text-teal-700" },
  { bgClass: "bg-indigo-50", bgHoverClass: "bg-indigo-100", textClass: "text-indigo-700" },
  { bgClass: "bg-emerald-50", bgHoverClass: "bg-emerald-100", textClass: "text-emerald-700" },
  { bgClass: "bg-orange-50", bgHoverClass: "bg-orange-100", textClass: "text-orange-700" },
  { bgClass: "bg-blue-50", bgHoverClass: "bg-blue-100", textClass: "text-blue-700" },
  { bgClass: "bg-fuchsia-50", bgHoverClass: "bg-fuchsia-100", textClass: "text-fuchsia-700" },
  { bgClass: "bg-pink-50", bgHoverClass: "bg-pink-100", textClass: "text-pink-700" },
  { bgClass: "bg-amber-50", bgHoverClass: "bg-amber-100", textClass: "text-amber-700" },
  { bgClass: "bg-slate-50", bgHoverClass: "bg-slate-100", textClass: "text-slate-700" },
];
