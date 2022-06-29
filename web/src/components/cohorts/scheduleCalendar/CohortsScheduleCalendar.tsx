import { gql } from "@apollo/client";
import {
  AssignmentSubject,
  CohortForCohortsScheduleCalendarFragment,
} from "@generated/graphql";
import { VideoCameraIcon } from "@heroicons/react/outline";
import { floatingToZonedDateTime } from "@utils/dateTime";
import { Routes } from "@utils/routes";
import { formatGrade } from "@utils/strings";
import { RoleText } from "components/RoleText";
import add from "date-fns/add";
import formatISO from "date-fns/formatISO";
import compact from "lodash/compact";
import { useRouter } from "next/router";
import { DEFAULT_EVENT_COLOR, EventColor } from "./EventColor";
import { CalendarEvent, ContentProps, WeekCalendar } from "./WeekCalendar";

CohortsScheduleCalendar.fragments = {
  cohort: gql`
    fragment CohortForCohortsScheduleCalendar on Cohort {
      id
      name
      grade
      startDate
      endDate
      events {
        startFloatingDateTime
        timeZone
        durationMinutes
        subject
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
        name
        organization {
          name
        }
      }
    }
  `,
};

export type TargetUserIds = string[];

type Props = {
  cohorts: CohortForCohortsScheduleCalendarFragment[]; // Multiple cohorts with schedule data
  targetUserIds?: TargetUserIds;
};

export function CohortsScheduleCalendar({
  cohorts,
  targetUserIds = [],
}: Props) {
  const weekCalendarSchedule = buildWeekCalendarSchedule(
    cohorts,
    targetUserIds
  );

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
  cohorts: CohortForCohortsScheduleCalendarFragment[],
  targetUserIds: TargetUserIds
): CalendarEvent[] {
  const events: CalendarEvent[] = cohorts.flatMap((cohort) => {
    return compact(
      cohort.events.map((event) => {
        const subjectStaff = cohort.staffAssignments.filter(
          (staffAssignment) => staffAssignment.subject === event.subject
        );

        // If provided a list of target user IDs filter cohorts for only events that
        // include one of the provided user IDs.
        if (
          targetUserIds.length !== 0 &&
          !subjectStaff.some((individual) =>
            targetUserIds.includes(individual.user.id)
          )
        ) {
          // Skip this event. None of the targeted user IDs are teaching this class.
          return undefined;
        }

        const startDateTime = floatingToZonedDateTime(
          new Date(event.startFloatingDateTime),
          event.timeZone
        );

        return {
          startDateTime,
          endDateTime: add(startDateTime, { minutes: event.durationMinutes }),
          durationMinutes: event.durationMinutes,
          timeZone: event.timeZone,
          cohortStartDate: cohort.startDate,
          cohortEndDate: cohort.endDate,

          groupKey: createSubjectKey(cohort.id, event.subject),
          title: `${event.subject}${
            cohort.grade && " (" + formatGrade(cohort.grade, false) + ")"
          } @ ${cohort.engagement.name}`,
          details: cohort.name,
          content: ({ eventColor }: { eventColor?: EventColor }) => (
            <CohortEventDetails
              cohortId={cohort.id}
              cohortRoomLink={cohort.meetingRoom}
              staffAssignments={subjectStaff}
              eventColor={eventColor}
            />
          ),
        };
      })
    );
  });

  return events;
}

function createSubjectKey(cohortId: string, subject: AssignmentSubject) {
  return `GROUP_${cohortId}_${subject}`;
}

type CohortEventDetailsProps = ContentProps & {
  cohortId: string;
  cohortRoomLink: string | null | undefined;
  staffAssignments: CohortForCohortsScheduleCalendarFragment["staffAssignments"];
};
function CohortEventDetails({
  cohortId,
  cohortRoomLink,
  staffAssignments,
  eventColor = DEFAULT_EVENT_COLOR,
}: CohortEventDetailsProps) {
  const { push } = useRouter();
  return (
    <div className="flex flex-col gap-2">
      {staffAssignments.length > 0 ? (
        staffAssignments
          .sort((a, b) => {
            if (a.user.role === b.user.role) {
              // Sort by full name alphabetic if role is identical.
              return a.user.fullName < b.user.fullName ? -1 : 1;
            }
            // Sort by role reverse alphabetic (Tutor before Mentor).
            return a.user.role < b.user.role ? 1 : -1;
          })
          .map((staffAssignment) => (
            <div key={staffAssignment.user.id} className="flex flex-col">
              <p className={`text-sm text-semibold ${eventColor?.text}`}>
                {staffAssignment.user.fullName}
              </p>
              <p className="text-xs italic text-gray-400">
                <RoleText className="" role={staffAssignment.user.role} /> (
                {staffAssignment.subject})
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
          onClick={() => push(Routes.cohortRoom.href(cohortId, "student"))}
          disabled={!cohortRoomLink}
        >
          {cohortRoomLink
            ? "Link to the classRoom"
            : "Class room not created yet"}
          <VideoCameraIcon
            className="ml-2 -mr-0.5 h-4 w-4"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}
