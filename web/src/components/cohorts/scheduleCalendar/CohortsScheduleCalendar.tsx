import { gql } from "@apollo/client";
import { VideoCameraIcon } from "@heroicons/react/outline";
import formatISO from "date-fns/formatISO";

import { CohortForScheduleCalendarFragment } from "@generated/graphql";
import { formatGrade } from "@utils/strings";
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
      engagement {
        organization {
          name
          description
        }
      }
    }
  `,
};

export type TargetUserIds = string[];

type CohortsScheduleCalendarProps = {
  cohorts: CohortForScheduleCalendarFragment[];  // Multiple cohorts with schedule data
  targetUserIds?: TargetUserIds;
};

export function CohortsScheduleCalendar({ cohorts, targetUserIds = [] }: CohortsScheduleCalendarProps) {
  const weekCalendarSchedule = buildWeekCalendarSchedule(cohorts, targetUserIds);

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

function buildWeekCalendarSchedule(
  cohorts: CohortForScheduleCalendarFragment[],
  targetUserIds: TargetUserIds,
): WeekCalendarEvent[] {
  const weekCalendarEvents: WeekCalendarEvent[] = [];

  // If provided a list of target user IDs filter cohorts for only events that
  // include one of the provided user IDs.
  cohorts.forEach((cohort, i) => {
    cohort.schedule.forEach(meeting => {
      // Build the list of assigned staff for this meeting.
      const subjectStaff = cohort.staffAssignments.filter(
        staffAssignment => staffAssignment.subject === meeting.subject,
      );

      // If an array of targetUserIds has been provided, check to make sure at
      // least one of them is present.
      if (targetUserIds.length !== 0 && !subjectStaff.some(
        individual => targetUserIds.includes(individual.user.id)
      )) {
        // Skip this event. None of the targeted user IDs are teaching this class.
        return;
      }

      weekCalendarEvents.push({
        weekday: meeting.weekday,
        timeZone: meeting.timeZone,
        startTime: meeting.startTime,
        endTime: meeting.endTime,
        startDate: cohort.startDate,
        endDate: cohort.endDate,
        groupKey: `${i}+${meeting.subject}`,
        title: `${meeting.subject}${cohort.grade && " (" + formatGrade(cohort.grade, false) + ")"} @ ${cohort.engagement.organization.name}`,
        details: `${cohort.engagement.organization.description} | ${cohort.name}`,
        content: ({ eventColor }) => (
          <CohortEventDetails
            staffAssignments={subjectStaff}
            eventColor={eventColor}
          />
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
