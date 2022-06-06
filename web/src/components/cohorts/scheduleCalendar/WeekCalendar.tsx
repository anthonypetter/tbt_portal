import { localizedWeekdays } from "@utils/dateTime";
import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react"


export function WeekCalendar() {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());

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
          {/* Mobile Collapsed Days Nav Row */}
          <MobileNav
            onClickDay={(day: number) => setSelectedDay(day)}
            currentDay={selectedDay}
            startDay={0}
          />

          {/* Desktop Days Nav Row */}
          <div className="-mr-px hidden grid-cols-7 divide-x divide-gray-100 border-r border-gray-100 text-sm leading-6 text-gray-500 sm:grid">
            <div className="col-end-1 w-14" />
            <div className="flex items-center justify-center py-3">
              <span>
                Mon <span className="items-center justify-center font-semibold text-gray-900">10</span>
              </span>
            </div>
            <div className="flex items-center justify-center py-3">
              <span>
                Tue <span className="items-center justify-center font-semibold text-gray-900">11</span>
              </span>
            </div>
            <div className="flex items-center justify-center py-3">
              <span className="flex items-baseline">
                Wed{' '}
                <span className="ml-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white">
                  12
                </span>
              </span>
            </div>
            <div className="flex items-center justify-center py-3">
              <span>
                Thu <span className="items-center justify-center font-semibold text-gray-900">13</span>
              </span>
            </div>
            <div className="flex items-center justify-center py-3">
              <span>
                Fri <span className="items-center justify-center font-semibold text-gray-900">14</span>
              </span>
            </div>
            <div className="flex items-center justify-center py-3">
              <span>
                Sat <span className="items-center justify-center font-semibold text-gray-900">15</span>
              </span>
            </div>
            <div className="flex items-center justify-center py-3">
              <span>
                Sun <span className="items-center justify-center font-semibold text-gray-900">16</span>
              </span>
            </div>
          </div>
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

type MobileNavProps = {
  onClickDay: (day: number) => void;
  currentDay: number; // index of day in nav; meaning 0 doesn't always mean Sunday.
  startDay?: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday start, which is the default.
}
function MobileNav({ onClickDay, currentDay, startDay = 0 }: MobileNavProps) {
  const weekdays = localizedWeekdays();
  const labels: string[] = [];

  for (let d = 0; d < 7; ++d) {
    labels.push(weekdays[(d + startDay) % 7].narrow);
  }

  return (
    <div className="grid grid-cols-7 text-sm leading-6 text-gray-900 sm:hidden">
      {labels.map((label, i) => (
        <button
          key={`${i}_${label}`}
          type="button"
          className="flex flex-col items-center pt-2 pb-3"
          onClick={() => onClickDay(i)}
        >
          <span
          className={clsx(
            "mt-1 flex h-8 w-8 items-center justify-center font-semibold",
            currentDay === i && "rounded-full bg-indigo-600 text-white"
          )}>
            {label}
          </span>
        </button>
      ))}

    </div>
  )
}