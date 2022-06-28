import {
  calculateMinutesElapsedInDay,
  IANAtzName,
  ISODate,
  localizedTime,
  LocalizedWeekday,
  localizedWeekdays,
  Minute,
  printDuration,
  Time24Hour,
  WeekdayNumber,
} from "@utils/dateTime";
import clsx from "clsx";
import { formatISO } from "date-fns";
import formatInTimeZone from "date-fns-tz/formatInTimeZone";
import utcToZonedTime from "date-fns-tz/utcToZonedTime";
import uniq from "lodash/uniq";
import { FC, Fragment, useEffect, useRef, useState } from "react";
import { EventColor, EVENT_COLORS } from "./EventColor";
import { Popover } from "./Popover";

export type ContentProps = {
  eventColor?: EventColor;
};

export type CalendarEvent = {
  timeZone: IANAtzName;
  startDateTime: Date;
  endDateTime: Date;
  durationMinutes: number;
  cohortStartDate: Date;
  cohortEndDate: Date;

  groupKey: string;
  title: string;
  details?: string;
  content?: FC<ContentProps>; // Custom sub component to show content.
};

type WeekCalendarProps = {
  events: CalendarEvent[];
  targetDate: ISODate; // Any date whose week will show in the calendar.
  locale: string;
  viewingTimeZone: IANAtzName;
  mode24Hour?: boolean;
};

export function WeekCalendar({
  events,
  targetDate,
  locale,
  viewingTimeZone,
  mode24Hour = false,
}: WeekCalendarProps) {
  // Get the current time of the viewingTimezone (allows for simulating different time zones).
  const currentViewerTime = utcToZonedTime(new Date(), viewingTimeZone);

  const currentDay = currentViewerTime.getDay() as WeekdayNumber;
  const [selectedDay, setSelectedDay] = useState(currentDay);

  const localizedWeekdaysList = localizedWeekdays(targetDate, locale);

  const container = useRef<HTMLDivElement>(null);
  const containerNav = useRef<HTMLDivElement>(null);
  const containerOffset = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      container?.current != null &&
      containerNav?.current != null &&
      containerOffset?.current != null
    ) {
      // Set the container scroll position based on the current viewing tz hour.
      // Cannot use currentViewerTime above without causing additional calls.
      const currentHourMinute =
        utcToZonedTime(new Date(), viewingTimeZone).getHours() * 60;
      const newScrollPosition =
        ((container.current.scrollHeight -
          containerNav.current.offsetHeight -
          containerOffset.current.offsetHeight) *
          currentHourMinute) /
        1440;

      // Give the component time to mount.
      setTimeout(() => {
        container?.current?.scrollTo({
          top: newScrollPosition,
          behavior: "smooth",
        });
      }, 100);
    }
  });

  return (
    <div
      ref={container}
      className="h-full flex flex-auto flex-col overflow-auto md:overflow-x-clip bg-white"
    >
      <div className="relative w-[165%] flex max-w-full flex-none flex-col sm:max-w-none md:max-w-full">
        {/* Days Nav Row */}
        <div
          ref={containerNav}
          className="sticky top-0 z-40 flex-none bg-white shadow ring-1 ring-black ring-opacity-5 sm:pr-8"
        >
          <MobileNav
            localizedWeekdays={localizedWeekdaysList}
            focusedDay={selectedDay}
            onClickDay={(navIndex: number) =>
              setSelectedDay(navIndex as WeekdayNumber)
            }
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
              style={{ gridTemplateRows: "repeat(48, minmax(3.5rem, 1fr))" }}
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
  const hourLabels = Array(24)
    .fill(0)
    .map((_, h) => `${String(h).padStart(2, "0")}:00`);
  return (
    <>
      {hourLabels.map((hour) => (
        <Fragment key={hour}>
          <div>
            <div className="sticky whitespace-nowrap left-0 z-20 -mt-2.5 -ml-14 w-14 pr-1 text-right text-xs leading-5 text-gray-400">
              {localizedTime(hour, mode24Hour, locale)}
            </div>
          </div>
          <div />
        </Fragment>
      ))}
    </>
  );
}

/**
 * Nav
 */

export type BaseWeekdayProps = {
  localizedWeekdays: LocalizedWeekday[];
  focusedDay: WeekdayNumber;
};

type MobileNavProps = BaseWeekdayProps & {
  onClickDay: (day: WeekdayNumber) => void;
};
function MobileNav({
  localizedWeekdays,
  focusedDay,
  onClickDay,
}: MobileNavProps) {
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
              focusedDay === i && "rounded-full bg-blue-600 text-white"
            )}
          >
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
          <span
            className={clsx(
              "items-center justify-center font-semibold capitalize",
              focusedDay === i &&
                "ml-1.5 flex h-8 w-10 rounded-full bg-blue-600 text-white"
            )}
          >
            {weekday.short}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * Events
 */

type Props = BaseWeekdayProps & {
  events: CalendarEvent[];
  locale: string;
  viewingTimeZone: IANAtzName;
  mode24Hour: boolean;
};

export function Events({
  localizedWeekdays,
  focusedDay,
  events,
  locale,
  viewingTimeZone,
  mode24Hour,
}: Props) {
  const uniqueKeys = uniq(events.map((e) => e.groupKey));

  return (
    <ol
      className="col-start-1 col-end-2 row-start-1 grid grid-cols-1 sm:grid-cols-7 sm:pr-8"
      style={{ gridTemplateRows: "1.75rem repeat(288, minmax(0, 1fr)) auto" }}
    >
      {events.map((event, i) => (
        <Event
          key={`${event.groupKey}_${i}`}
          event={event}
          localizedWeekdays={localizedWeekdays}
          focusedDay={focusedDay}
          locale={locale}
          mode24Hour={mode24Hour}
          viewingTimeZone={viewingTimeZone}
          groupNumber={uniqueKeys.findIndex((key) => key === event.groupKey)}
        />
      ))}
    </ol>
  );
}

/**
 * Event
 */

type EventProps = {
  event: CalendarEvent;
  localizedWeekdays: LocalizedWeekday[];
  focusedDay: WeekdayNumber;
  locale: string;
  mode24Hour: boolean;
  viewingTimeZone: IANAtzName;
  groupNumber: number;
};

export function Event({
  event,
  localizedWeekdays,
  focusedDay,
  locale,
  mode24Hour,
  viewingTimeZone,
  groupNumber,
}: EventProps) {
  const startInfo = getDateInfo(event.startDateTime);
  const startGridRow = startInfo.minutesElapsedInDay / 5 + 2;
  const gridSpan = Math.max(Math.ceil(event.durationMinutes / 5), 3);
  const eventColor = EVENT_COLORS[groupNumber % EVENT_COLORS.length];

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
        startInfo.weekdayNumber !== focusedDay && "hidden",
        weekColStartClasses[startInfo.weekdayNumber],
        "sm:flex"
      )}
      style={{ gridRow: `${startGridRow} / span ${gridSpan}` }}
    >
      <Popover
        placement="top-start"
        render={() => (
          <EventPopover
            event={event}
            localizedWeekdays={localizedWeekdays}
            locale={locale}
            mode24Hour={mode24Hour}
            eventColor={eventColor}
            viewingTimeZone={viewingTimeZone}
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
            <time dateTime={`${startInfo.isoDate}T${startInfo.time}`}>
              {localizedTime(startInfo.time, mode24Hour, locale)}
            </time>
          </p>
          <p className={`font-semibold leading-tight ${eventColor.text}`}>
            {event.title || "Untitled Event"}
          </p>
          {event.details && (
            <p className={`font-normal leading-tight ${eventColor.text}`}>
              {event.details}
            </p>
          )}
        </a>
      </Popover>
    </li>
  );
}

type EventPopoverProps = Pick<
  EventProps,
  "event" | "localizedWeekdays" | "locale" | "mode24Hour" | "viewingTimeZone"
> & {
  eventColor: EventColor;
};

function EventPopover({
  event,
  localizedWeekdays,
  locale,
  mode24Hour,
  eventColor,
  viewingTimeZone,
}: EventPopoverProps) {
  const startInfo = getDateInfo(event.startDateTime);
  const endInfo = getDateInfo(event.endDateTime);

  const dateFormat = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });
  return (
    <div className="relative z-30 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
      <div className="flex flex-row bg-white gap-3 px-2 py-3 sm:p-3 w-[350px]">
        {/* Left section */}
        <div className="flex flex-col place-content-between w-auto my-1">
          <div className="flex flex-col gap-1">
            <p
              className={`font-semibold text-sm whitespace-nowrap ${eventColor.text}`}
            >
              {localizedTime(startInfo.time, mode24Hour, locale)}
            </p>
            <p
              className={`font-normal text-xs whitespace-nowrap ${eventColor.text}`}
            >
              {localizedTime(endInfo.time, mode24Hour, locale)}
            </p>
            <p
              className={`font-normal text-xs whitespace-nowrap capitalize ${eventColor.text}`}
            >
              {localizedWeekdays[startInfo.weekdayNumber].long}
            </p>
          </div>

          <div>
            <p
              className={`font-normal text-xs whitespace-nowrap italic ${eventColor.text}`}
            >
              {printDuration(event.durationMinutes, 60)}
            </p>
          </div>
        </div>

        {/* Vertical line */}
        <div
          className={`shrink-0 w-0.5 h-auto rounded-sm ${eventColor.accent}`}
        ></div>

        {/* Right section */}
        <div className="grow flex flex-col gap-2 my-1">
          <div className="flex flex-col gap-1">
            <p
              className={`font-semibold text-sm leading-tight ${eventColor.text}`}
            >
              {event.title || "Untitled Event"}
            </p>
            <p className="font-normal text-xs text-gray-500 tabular-nums">
              {dateFormat.format(event.cohortStartDate)} -{" "}
              {dateFormat.format(event.cohortEndDate)}
            </p>
            {event.details && (
              <p className="font-normal text-xs leading-snug text-gray-500">
                {event.details}
              </p>
            )}
          </div>
          {event.content && event.content({ eventColor })}
          {viewingTimeZone !== event.timeZone && (
            <p className="font-normal text-xs leading-none text-gray-400 italic">
              {localizedTime(
                formatInTimeZone(event.startDateTime, event.timeZone, "HH:mm"),
                mode24Hour,
                locale
              )}{" "}
              Local Start Time
              <br />({event.timeZone.replace("_", " ")})
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function getDateInfo(date: Date): {
  isoDate: ISODate;
  weekdayNumber: WeekdayNumber;
  time: Time24Hour;
  minutesElapsedInDay: Minute;
} {
  const isoDate = formatISO(date, { representation: "date" });
  const weekdayNumber = date.getDay() as WeekdayNumber;

  const time = formatISO(date, {
    representation: "time",
  }).slice(0, 5); // Grab "00:00" from "00:00Z"

  const minutesElapsedInDay = calculateMinutesElapsedInDay(time);

  return {
    isoDate,
    weekdayNumber,
    time,
    minutesElapsedInDay,
  };
}
