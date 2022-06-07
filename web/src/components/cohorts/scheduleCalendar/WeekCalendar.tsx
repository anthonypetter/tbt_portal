import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react"

import { LocalizedWeekday, localizedWeekdays, Weekday, WeekdayNumber } from "@utils/dateTime";

// Consult https://date-fns.org/v2.28.0/docs/parse
// and https://github.com/marnusw/date-fns-tz#formatintimezone

export type WeekCalendarEvent = {
  weekday: Weekday;
  startTime: string;  // H:mm - 24 hour format
  endTime: string;    // H:mm - 24 hour format
  timezone: string;   // IANA time zone name
  title: string;      // Event title
  details?: string;   // Event details
  groupId: number;    // Used to color-coordinate.
};

type WeekCalendarProps = {
  events: WeekCalendarEvent[];
  viewingTimezone: string;
  startDay?: WeekdayNumber;
};
export function WeekCalendar({ startDay = 0 }: WeekCalendarProps) {
  const currentDay = new Date().getDay();
  const [selectedDay, setSelectedDay] = useState(currentDay);
  const weekdays = getWeekdays(startDay);

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
            weekdays={weekdays}
            onClickDay={(day: number) => setSelectedDay(day)}
            currentDay={selectedDay}
            startDay={startDay}
          />
          <FullNav
            weekdays={weekdays}
            currentDay={currentDay}
            startDay={startDay}
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
        <>
        <div key={hour}>
          <div className="sticky left-0 z-20 -mt-2.5 -ml-14 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
            {hour}
          </div>
        </div>
        <div />
      </>
      ))}
    </>
  );
}


/**
 * Small helper takes the desired start day of the week and returns an array
 * of weekdays sorted in a row with the first item [0] being the start day of
 * the week.
 * @param startDay
 * @returns
 */
function getWeekdays(startDay: number): LocalizedWeekday[] {
  const weekdays = localizedWeekdays();
  const orderedWeekdays: LocalizedWeekday[] = [];

  for (let d = 0; d < 7; ++d) {
    orderedWeekdays.push(weekdays[(d + startDay) % 7]);
  }
  return orderedWeekdays;
}


type BaseNavProps = {
  weekdays: LocalizedWeekday[];
  currentDay: number; // index of day in nav; meaning 0 doesn't always mean Sunday.
  startDay?: WeekdayNumber; // 0 = Sunday start, which is the default.
};

type MobileNavProps = BaseNavProps & {
  onClickDay: (day: number) => void;
}
function MobileNav({ onClickDay, currentDay, startDay = 0 }: MobileNavProps) {
  const weekdays = getWeekdays(startDay);

  return (
    <div className="grid grid-cols-7 text-sm leading-6 text-gray-900 sm:hidden">
      {weekdays.map((weekday, i) => (
        <button
          key={weekday.long}
          type="button"
          className="flex flex-col items-center pt-2 pb-3"
          onClick={() => onClickDay(i)}
        >
          <span
          className={clsx(
            "mt-1 flex h-8 w-8 items-center justify-center font-semibold",
            currentDay === i && "rounded-full bg-indigo-600 text-white"
          )}>
            {weekday.narrow}
          </span>
        </button>
      ))}
    </div>
  );
}

type FullNavProps = BaseNavProps;
function FullNav({ currentDay, startDay = 0 }: FullNavProps) {
  const weekdays = getWeekdays(startDay);
  console.table(weekdays);

  return (
    <div className="-mr-px hidden grid-cols-7 divide-x divide-gray-100 border-r border-gray-100 text-sm leading-6 text-gray-500 sm:grid">
      <div className="col-end-1 w-14" />
      {weekdays.map((weekday, i) => (
        <div
          key={weekday.long}
          className="flex items-center justify-center py-3 text-gray-900"
        >
          <span className={clsx(
            "items-center justify-center font-semibold ",
            (currentDay + startDay) % 7 === i &&
              "ml-1.5 flex h-8 w-10 rounded-full bg-indigo-600 text-white",
          )}>
            {weekday.short}
          </span>
        </div>
      ))}
    </div>
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
