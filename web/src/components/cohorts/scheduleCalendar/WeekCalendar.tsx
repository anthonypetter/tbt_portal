import clsx from "clsx";
import toDate from "date-fns-tz/toDate";
import utcToZonedTime from "date-fns-tz/utcToZonedTime";
import formatISO from "date-fns/formatISO";
import { FC, Fragment, useEffect, useRef, useState } from "react";

import { Weekday } from "@generated/graphql";
import {
  calculateMinutesElapsedInDay,
  findWeekdayNumber,
  IANAtzName,
  ISODate,
  localizedTime,
  LocalizedWeekday,
  localizedWeekdays,
  Minute,
  normalizeTime,
  printDuration,
  Time24Hour,
  WeekdayNumber
} from "@utils/dateTime";
import { Popover } from "./Popover";

export type ContentProps = {
  eventColor?: EventColor;
};

export type WeekCalendarEvent = {
  weekday: Weekday;
  startTime: Time24Hour;  // H:mm - 24 hour format.
  endTime: Time24Hour;    // H:mm - 24 hour format.
  timeZone: IANAtzName;   // IANA time zone name.
  title: string;          // Event title.
  details?: string;       // Event details.
  groupKey: string;       // Used to color-coordinate events.
  startDate?: Date;       // Used to filter out events outside the targetDate...
  endDate?: Date;         // ... if left blank event will not show.
  content?: FC<ContentProps>; // Custom sub component to show content.
};

type AdjustedWeekCalendarEvent = WeekCalendarEvent & {
  adjustedTimeZone: IANAtzName;
  groupNumber: number;
  adjustedStartIsoDate: ISODate;
  adjustedStartWeekdayNumber: WeekdayNumber;
  adjustedStartTime: Time24Hour;
  adjustedEndWeekdayNumber: WeekdayNumber;
  adjustedEndTime: Time24Hour;
  adjustedStartMinute: Minute;
  eventMinuteLength: Minute;
};

type WeekCalendarProps = {
  events: WeekCalendarEvent[];
  targetDate: ISODate;  // Any date whose week will show in the calendar.
  locale: string;
  viewingTimeZone: IANAtzName;
  mode24Hour?: boolean;
};
export function WeekCalendar(
  { events, targetDate, locale, viewingTimeZone, mode24Hour = false }: WeekCalendarProps
) {
  // Get the current time of the viewingTimezone (allows for simulating different time zones).
  const currentViewerTime = utcToZonedTime(new Date(), viewingTimeZone);

  const currentDay = currentViewerTime.getDay() as WeekdayNumber;
  const [selectedDay, setSelectedDay] = useState(currentDay);

  const localizedWeekdaysList = localizedWeekdays(targetDate, locale);

  const container = useRef<HTMLDivElement>(null);
  const containerNav = useRef<HTMLDivElement>(null);
  const containerOffset = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container?.current != null &&
      containerNav?.current != null &&
      containerOffset?.current != null
    ) {
      // Set the container scroll position based on the current viewing tz hour.
      // Cannot use currentViewerTime above without causing additional calls.
      const currentHourMinute = utcToZonedTime(new Date(), viewingTimeZone).getHours() * 60;
      const newScrollPosition =
        ((container.current.scrollHeight -
          containerNav.current.offsetHeight -
          containerOffset.current.offsetHeight) *
          currentHourMinute) /
        1440;

      // Give the component time to mount.
      setTimeout(() => {
        container?.current?.scrollTo({ top: newScrollPosition, behavior: "smooth" });
      }, 100);
    }
  });

  return (
    <div ref={container} className="h-[70vh] flex flex-auto flex-col overflow-auto md:overflow-x-clip bg-white">
      <div className="w-[165%] flex max-w-full flex-none flex-col sm:max-w-none md:max-w-full">
        {/* Days Nav Row */}
        <div
          ref={containerNav}
          className="sticky top-0 z-40 flex-none bg-white shadow ring-1 ring-black ring-opacity-5 sm:pr-8"
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
              <HourLines locale={locale} mode24Hour={mode24Hour} />
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
              locale={locale}
              viewingTimeZone={viewingTimeZone}
              mode24Hour={mode24Hour}
            />
          </div>
        </div>
      </div>
    </div>
  );
}


type HourLinesProps = {
  locale: string;
  mode24Hour: boolean;
};
function HourLines({ locale, mode24Hour }: HourLinesProps) {
  const hourLabels = Array(24).fill(0).map((_, h) => `${String(h).padStart(2, "0")}:00`);
  return (
    <>
      {hourLabels.map(hour => (
        <Fragment key={hour}>
          <div>
            <div className="sticky whitespace-nowrap left-0 z-20 -mt-2.5 -ml-14 w-14 pr-1 text-right text-xs leading-5 text-gray-400">
              {localizedTime(hour, mode24Hour, locale)}
            </div>
          </div>
          <div />
        </Fragment >
      ))}
    </>
  );
}


type BaseWeekdayProps = {
  localizedWeekdays: LocalizedWeekday[];
  focusedDay: WeekdayNumber;
};

type MobileNavProps = BaseWeekdayProps & {
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
            "mt-1 flex h-8 w-8 items-center justify-center font-semibold uppercase",
            focusedDay === i && "rounded-full bg-indigo-600 text-white"
          )}>
            {weekday.narrow}
          </span>
        </button>
      ))}
    </div>
  );
}

type FullNavProps = BaseWeekdayProps;
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
            "items-center justify-center font-semibold capitalize",
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

type EventsProps = BaseWeekdayProps & {
  events: WeekCalendarEvent[];
  locale: string;
  viewingTimeZone: IANAtzName;
  mode24Hour: boolean;
};
function Events({
  localizedWeekdays,
  focusedDay,
  events,
  locale,
  viewingTimeZone,
  mode24Hour,
}: EventsProps) {
  const adjustedEvents: AdjustedWeekCalendarEvent[] = [];

  // Organize events by an arbitrary group number based on their groupKey.
  let groupNumber = 0;
  const groups: {[groupKey: string]: number} = {};

  events.forEach(event => {
    // Get the local date of the event.
    const eventLocalIsoDate = localizedWeekdays[findWeekdayNumber(event.weekday)].isoDate;

    // Don't show events that do not have start/end dates.
    if (event.startDate == null || event.endDate == null) {
      return;
    }

    // Get the local start+end DATE boundaries of the event group.
    // Note that these are DIFFERENT from event start+end TIMES.
    const eventLocalStartIsoDate = formatISO(
      toDate(event.startDate, { timeZone: event.timeZone }),
      { representation: "date" }
    );
    const eventLocalEndIsoDate = formatISO(
      toDate(event.endDate, { timeZone: event.timeZone }),
      { representation: "date" }
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

    // If a new groupKey is encountered, give it a new number.
    if (groups[event.groupKey] == null) {
      groups[event.groupKey] = groupNumber++;
    }

    // Adjust start Date+Time+Weekday to viewing time zone.
    const adjustedEventStartDateTime = utcToZonedTime(eventStartDateTime, viewingTimeZone);
    const adjustedStartIsoDate = formatISO(
      adjustedEventStartDateTime,
      { representation: "date" }
    );
    const adjustedStartWeekdayNumber = adjustedEventStartDateTime.getDay() as WeekdayNumber;
    const adjustedStartTime = formatISO(
      adjustedEventStartDateTime,
      { representation: "time" }
    ).slice(0, 5);  // Grab "00:00" from "00:00Z"

    // Adjust end Time+Weekday to viewing time zone.
    const adjustedEventEndDateTime = utcToZonedTime(eventEndDateTime, viewingTimeZone);
    const adjustedEndWeekdayNumber = adjustedEventEndDateTime.getDay() as WeekdayNumber;
    const adjustedEndTime = formatISO(
      adjustedEventEndDateTime,
      { representation: "time" },
    ).slice(0, 5);  // Grab "00:00" from "00:00Z"

    const adjustedStartMinute = calculateMinutesElapsedInDay(adjustedStartTime);
    const adjustedEndMinute = calculateMinutesElapsedInDay(adjustedEndTime);

    adjustedEvents.push({
      ...event,
      adjustedTimeZone: viewingTimeZone,
      groupNumber: groups[event.groupKey] || 0,
      adjustedStartIsoDate,
      adjustedStartWeekdayNumber,
      adjustedStartTime,
      adjustedEndWeekdayNumber,
      adjustedEndTime,
      adjustedStartMinute,
      eventMinuteLength: adjustedEndMinute - adjustedStartMinute +
        (adjustedEndMinute < adjustedStartMinute ? 1440 : 0),
    });
  });

  return (
    <ol
      className="col-start-1 col-end-2 row-start-1 grid grid-cols-1 sm:grid-cols-7 sm:pr-8"
      style={{ gridTemplateRows: '1.75rem repeat(288, minmax(0, 1fr)) auto' }}
    >
      {adjustedEvents.map((adjustedEvent, i) => (
        <Event
          key={`${adjustedEvent.groupKey}_${i}`}
          adjustedEvent={adjustedEvent}
          localizedWeekdays={localizedWeekdays}
          focusedDay={focusedDay}
          locale={locale}
          mode24Hour={mode24Hour}
        />
      ))}
    </ol>
  );
}

type EventProps = {
  adjustedEvent: AdjustedWeekCalendarEvent;
  localizedWeekdays: LocalizedWeekday[];
  focusedDay: WeekdayNumber;
  locale: string;
  mode24Hour: boolean;
};
function Event({
  adjustedEvent,
  localizedWeekdays,
  focusedDay,
  locale,
  mode24Hour,
}: EventProps) {
  const startGridRow = adjustedEvent.adjustedStartMinute / 5 + 2;
  const gridSpan = Math.max(Math.ceil(adjustedEvent.eventMinuteLength / 5), 3);
  const eventColor = EVENT_COLORS[adjustedEvent.groupNumber % EVENT_COLORS.length];

  // Need this array defined because we're using the `sm:` prefix, cannot just
  // define the `gridColumnStart: weekdayIndex + 1` in the li's style prop.
  const weekColStartClasses = [
    "sm:col-start-1", // sunday...
    "sm:col-start-2",
    "sm:col-start-3",
    "sm:col-start-4", // ...wednesday...
    "sm:col-start-5",
    "sm:col-start-6",
    "sm:col-start-7", // ...saturday
  ];

  return (
    <li
      className={clsx(
        "relative mt-px",
        adjustedEvent.adjustedStartWeekdayNumber !== focusedDay && "hidden",
        weekColStartClasses[adjustedEvent.adjustedStartWeekdayNumber],
        "sm:flex",
      )}
      style={{ gridRow: `${startGridRow} / span ${gridSpan}` }}
    >
      <Popover
        placement="top-start"
        render={() => (
          <EventPopover
            adjustedEvent={adjustedEvent}
            localizedWeekdays={localizedWeekdays}
            locale={locale}
            mode24Hour={mode24Hour}
            eventColor={eventColor}
          />
        )}
      >
        <a
          href="#"
          className={clsx(
            "group absolute inset-1 flex flex-col hover:z-20 overflow-y-auto rounded-lg p-2 text-xs leading-5",
            `${eventColor.bg} ${eventColor.bgHover}`
          )}
        >
          <p className={`${eventColor.text} ${eventColor.textHover}`}>
            <time dateTime={`${adjustedEvent.adjustedStartIsoDate}T${adjustedEvent.adjustedStartTime}`}>
              {localizedTime(adjustedEvent.adjustedStartTime, mode24Hour, locale)}
            </time>
          </p>
          <p className={`font-semibold leading-tight ${eventColor.text}`}>
            {adjustedEvent.title || "Untitled Event"}
          </p>
          {adjustedEvent.details && (
            <p className={`font-normal leading-tight ${eventColor.text}`}>
              {adjustedEvent.details}
            </p>
          )}
        </a>
      </Popover>
    </li>
  )
}


type EventPopoverProps = Pick<
  EventProps, "adjustedEvent" | "localizedWeekdays" | "locale" | "mode24Hour"
> & {
  eventColor: EventColor;
};
function EventPopover({
  adjustedEvent,
  localizedWeekdays,
  locale,
  mode24Hour,
  eventColor,
}: EventPopoverProps) {
  const dateFormat = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });
  return (
    <div className="relative z-30 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
      <div className="flex flex-row bg-white gap-3 px-2 py-3 sm:p-3 w-[350px]">
        {/* Left section */}
        <div className="flex flex-col place-content-between w-auto my-1">
          <div className="flex flex-col gap-1">
            <p className={`font-semibold text-sm whitespace-nowrap ${eventColor.text}`}>
              {localizedTime(adjustedEvent.adjustedStartTime, mode24Hour, locale)}
            </p>
            <p className={`font-normal text-xs whitespace-nowrap ${eventColor.text}`}>
              {localizedTime(adjustedEvent.adjustedEndTime, mode24Hour, locale)}
            </p>
            <p className={`font-normal text-xs whitespace-nowrap capitalize ${eventColor.text}`}>
              {localizedWeekdays[adjustedEvent.adjustedStartWeekdayNumber].long}
            </p>
          </div>

          <div>
            <p className={`font-normal text-xs whitespace-nowrap italic ${eventColor.text}`}>
              {printDuration(adjustedEvent.eventMinuteLength, 60)}
            </p>
          </div>
        </div>

        {/* Vertical line */}
        <div className={`shrink-0 w-0.5 h-auto rounded-sm ${eventColor.accent}`}></div>

        {/* Right section */}
        <div className="grow flex flex-col gap-2 my-1">
          <div className="flex flex-col gap-1">
            <p className={`font-semibold text-sm leading-tight ${eventColor.text}`}>
              {adjustedEvent.title || "Untitled Event"}
            </p>
            <p className="font-normal text-xs text-gray-500 tabular-nums">
              {dateFormat.format(adjustedEvent.startDate)} - {dateFormat.format(adjustedEvent.endDate)}
            </p>
            {adjustedEvent.details && (
              <p className="font-normal text-xs leading-snug text-gray-500">
                {adjustedEvent.details}
              </p>
            )}
          </div>
          {adjustedEvent.content && adjustedEvent.content({ eventColor })}
          {adjustedEvent.adjustedTimeZone !== adjustedEvent.timeZone && (
            <p className="font-normal text-xs leading-none text-gray-400 italic">
              {localizedTime(adjustedEvent.startTime, mode24Hour, locale)}
              {" "}
              Local Start Time
              <br />
              ({adjustedEvent.timeZone.replace("_", " ")})
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

type EventColor = {
  bg: string;
  bgHover: string;
  text: string;
  textHover: string;
  accent: string;
}
const EVENT_COLORS: EventColor[] = [
  { bg: "bg-green-50", bgHover: "hover:bg-green-100", text: "text-green-500", textHover: "group-hover:text-green-700", accent: "bg-green-700" },
  { bg: "bg-yellow-50", bgHover: "hover:bg-yellow-100", text: "text-yellow-500", textHover: "group-hover:text-yellow-700", accent: "bg-yellow-700" },
  { bg: "bg-teal-50", bgHover: "hover:bg-teal-100", text: "text-teal-500", textHover: "group-hover:text-teal-700", accent: "bg-teal-700" },
  { bg: "bg-indigo-50", bgHover: "hover:bg-indigo-100", text: "text-indigo-500", textHover: "group-hover:text-indigo-700", accent: "bg-indigo-700" },
  { bg: "bg-emerald-50", bgHover: "hover:bg-emerald-100", text: "text-emerald-500", textHover: "group-hover:text-emerald-700", accent: "bg-emerald-700" },
  { bg: "bg-orange-50", bgHover: "hover:bg-orange-100", text: "text-orange-500", textHover: "group-hover:text-orange-700", accent: "bg-orange-700" },
  { bg: "bg-blue-50", bgHover: "hover:bg-blue-100", text: "text-blue-500", textHover: "group-hover:text-blue-700", accent: "bg-blue-700" },
  { bg: "bg-fuchsia-50", bgHover: "hover:bg-fuchsia-100", text: "text-fuchsia-500", textHover: "group-hover:text-fuchsia-700", accent: "bg-fuchsia-700" },
  { bg: "bg-pink-50", bgHover: "hover:bg-pink-100", text: "text-pink-500", textHover: "group-hover:text-pink-700", accent: "bg-pink-700" },
  { bg: "bg-amber-50", bgHover: "hover:bg-amber-100", text: "text-amber-500", textHover: "group-hover:text-amber-700", accent: "bg-amber-700" },
  { bg: "bg-slate-50", bgHover: "hover:bg-slate-100", text: "text-slate-500", textHover: "group-hover:text-slate-700", accent: "bg-slate-700" },
];

export const DEFAULT_EVENT_COLOR: EventColor = {
  bg: "bg-gray-50",
  bgHover: "hover:bg-gray-100",
  text: "text-gray-500",
  textHover: "group-hover:text-gray-700",
  accent: "bg-gray-700",
};
