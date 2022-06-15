import { gql } from "@apollo/client";
import { VideoCameraIcon } from "@heroicons/react/outline";
import formatISO from "date-fns/formatISO";

import { CohortForScheduleCalendarFragment } from "@generated/graphql";
import { RoleText } from "components/RoleText";
import {
  ContentProps,
  DEFAULT_EVENT_COLOR,
  WeekCalendar,
  WeekCalendarEvent
} from "./WeekCalendar";

CohortsScheduleCalendar.fragments = {
  cohort: gql`
    fragment CohortForScheduleCalendar on Cohort {
      name
      grade
      startDate
      endDate
      schedule {
        weekday
        subject
        startTime
        endTime
        timeZone
      }
      staffAssignments {
        user {
          id
          role
          fullName
        }
        subject
      }
      meetingRoom
      hostKey
      meetingId
    }
  `,
};

type CohortsScheduleCalendarProps = {
  cohorts: CohortForScheduleCalendarFragment[],  // Multiple cohorts with schedule data
};

export function CohortsScheduleCalendar({ cohorts }: CohortsScheduleCalendarProps) {
  const weekCalendarSchedule = buildWeekCalendarSchedule(cohorts);

  return (
    <WeekCalendar
      events={weekCalendarSchedule}
      targetDate={formatISO(new Date(), { representation: "date" })}
      locale={Intl.NumberFormat().resolvedOptions().locale}
      // locale="ja-JP" // Good for testing: Shows how flexible the locale can be
      viewingTimeZone={Intl.DateTimeFormat().resolvedOptions().timeZone}
      // viewingTimeZone="Asia/Tokyo" // Good for testing: Often the next day
      mode24Hour={false}
    />
  );
}

function buildWeekCalendarSchedule(cohorts: CohortForScheduleCalendarFragment[]): WeekCalendarEvent[] {
  const weekCalendarEvents: WeekCalendarEvent[] = [];

  cohorts.forEach((cohort, i) => {
    cohort.schedule.forEach(day => {
      const subjectStaff = cohort.staffAssignments.filter(
        staffAssignment => staffAssignment.subject === day.subject,
      );

      weekCalendarEvents.push({
        weekday: day.weekday,
        timeZone: day.timeZone,
        startTime: day.startTime,
        endTime: day.endTime,
        startDate: cohort.startDate,
        endDate: cohort.endDate,
        groupKey: `${i}+${day.subject}`,
        title: `${cohort.grade && cohort.grade + ": "}${day.subject}`,
        details: `${cohort.name}`,
        content: ({ eventColor }) => (
          <CohortEventDetails staffAssignments={subjectStaff} eventColor={eventColor} />
        ),
      })
    });
  });

  return weekCalendarEvents;
}

type CohortEventDetailsProps = ContentProps & {
  staffAssignments: CohortForScheduleCalendarFragment["staffAssignments"];
};
function CohortEventDetails({
  staffAssignments,
  eventColor = DEFAULT_EVENT_COLOR,
}: CohortEventDetailsProps) {
  return (
    <div className="flex flex-col gap-2">
      {staffAssignments.length > 0 ? (
        staffAssignments.sort(
          (a, b) => {
            if (a.user.role === b.user.role) {
              // Sort by full name alphabetic if role is identical.
              return a.user.fullName < b.user.fullName ? -1 : 1;
            }
            // Sort by role reverse alphabetic (Tutor before Mentor).
            return a.user.role < b.user.role ? 1 : -1;
          }
        ).map(staffAssignment => (
          <div key={staffAssignment.user.id} className="flex flex-col">
            <p className={`text-sm text-semibold ${eventColor?.text}`}>
              {staffAssignment.user.fullName}
            </p>
            <p className="text-xs italic text-gray-400">
              <RoleText className="" role={staffAssignment.user.role} />
              {" "}
              ({staffAssignment.subject})
            </p>
          </div>
        ))
      ) : (
        <p className="text-sm text-semibold">
          No staff has been assigned to this subject.
        </p>
      )}
      <div className="flex flex-row">
        <button
          type="button"
          className={`inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md ${eventColor.text} ${eventColor.bg} ${eventColor.bgHover} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500`}
        >
          Link to the Classroom
          <VideoCameraIcon className="ml-2 -mr-0.5 h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
