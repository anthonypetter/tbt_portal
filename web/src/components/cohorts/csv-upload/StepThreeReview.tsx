import {
  AssignmentSubject,
  CsvUploadView_EngagementFragment,
} from "@generated/graphql";
import {
  ProcessedCohort,
  StaffAssignment,
  SubjectSchedule,
} from "@utils/csv/parseCsv";
import { stringifyTime } from "@utils/dateTime";
import { assertUnreachable } from "@utils/types";
import clsx from "clsx";
import { Button } from "components/Button";
import { NormalizedDateText } from "components/NormalizedDateText";
import { ReactNode } from "react";

type Props = {
  engagement: CsvUploadView_EngagementFragment;
  processedCsv: ProcessedCohort[] | null;
  onApprove: () => void;
};

export function StepThreeReview({
  engagement,
  processedCsv,
  onApprove,
}: Props) {
  if (!processedCsv) {
    return null;
  }

  return (
    <div className="my-4 max-w-full">
      <p className="text-sm text-gray-900 pb-2">
        Engagement: {engagement.name}
      </p>
      <p className="text-sm text-gray-900 pb-2">
        Dates: <NormalizedDateText timeMs={engagement.startDate} /> -
        <NormalizedDateText timeMs={engagement.endDate} />
      </p>
      <div className="overflow-x-auto">
        <ReviewTable processedCsv={processedCsv} />
      </div>
      <div className="mt-4">
        <Button theme="tertiary" onClick={() => onApprove()}>
          Approve
        </Button>
      </div>
    </div>
  );
}

type ReviewTableProps = {
  processedCsv: ProcessedCohort[];
};

function ReviewTable({ processedCsv }: ReviewTableProps) {
  return (
    <div className="mt-2 flex flex-col overflow-x-auto">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300 overflow-x-auto">
            <thead>
              <tr>
                <CondensedTh>Cohort</CondensedTh>
                <CondensedTh>Grade</CondensedTh>
                <CondensedTh>Mon</CondensedTh>
                <CondensedTh>Tue</CondensedTh>
                <CondensedTh>Wed</CondensedTh>
                <CondensedTh>Thu</CondensedTh>
                <CondensedTh>Fri</CondensedTh>
                <CondensedTh>Sat</CondensedTh>
                <CondensedTh>Sun</CondensedTh>
                <CondensedTh>Staff</CondensedTh>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {processedCsv.map((row) => (
                <tr key={row.cohortName}>
                  <CondensedTd className="font-medium text-gray-900">
                    {row.cohortName}
                  </CondensedTd>
                  <CondensedTd>{row.grade}</CondensedTd>
                  <CondensedTd>
                    <SchedulesCell weekday="monday" schedules={row.monday} />
                  </CondensedTd>
                  <CondensedTd>
                    <SchedulesCell weekday="tuesday" schedules={row.tuesday} />
                  </CondensedTd>
                  <CondensedTd>
                    <SchedulesCell
                      weekday="wednesday"
                      schedules={row.wednesday}
                    />
                  </CondensedTd>
                  <CondensedTd>
                    <SchedulesCell
                      weekday="thursday"
                      schedules={row.thursday}
                    />
                  </CondensedTd>
                  <CondensedTd>
                    <SchedulesCell weekday="friday" schedules={row.friday} />
                  </CondensedTd>
                  <CondensedTd>
                    <SchedulesCell
                      weekday="saturday"
                      schedules={row.saturday}
                    />
                  </CondensedTd>
                  <CondensedTd>
                    <SchedulesCell weekday="sunday" schedules={row.sunday} />
                  </CondensedTd>
                  <CondensedTd>
                    <StaffCell
                      cohortName={row.cohortName}
                      assignments={row.staffAssignments}
                    />
                  </CondensedTd>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CondensedTh({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <th
      scope="col"
      className={clsx(
        "py-2 px-2 text-left text-xs font-semibold text-gray-900",
        className
      )}
    >
      {children}
    </th>
  );
}

function CondensedTd({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <td
      className={clsx(
        "whitespace-nowrap px-0 py-1 text-xs text-gray-500 border text-center",
        className
      )}
    >
      {children}
    </td>
  );
}

function SchedulesCell({
  weekday,
  schedules,
}: {
  weekday: string;
  schedules: SubjectSchedule[];
}) {
  if (schedules.length === 0) {
    return <span className="mx-1">None</span>;
  }

  return (
    <div className="divide-y">
      {schedules.map((schedule, i) => {
        return (
          <div key={`${weekday}-${i}`} className="flex flex-col py-1">
            <div className="flex px-2">
              <div>{getDisplayNameForSubject(schedule.subject)}:</div>
              <div>{stringifyTime(schedule.startTime)}</div>
              {"-"}
              <div>{stringifyTime(schedule.endTime)}</div>
            </div>
            <div className="px-2">Time zone: {schedule.timeZone}</div>
          </div>
        );
      })}
    </div>
  );
}

function getDisplayNameForSubject(subject: AssignmentSubject) {
  switch (subject) {
    case AssignmentSubject.Math:
      return "MATH";

    case AssignmentSubject.Ela:
      return "ELA";

    case AssignmentSubject.General:
      return "GEN";

    default:
      assertUnreachable(subject, "subject");
  }
}

function StaffCell({
  cohortName,
  assignments,
}: {
  cohortName: string;
  assignments: StaffAssignment[];
}) {
  if (assignments.length === 0) {
    return <span className="mx-1">None Assigned</span>;
  }

  return (
    <div className="divide-y">
      {assignments.map(({ subject, teacher }) => {
        return (
          <div
            key={`${cohortName}-${subject}-staff`}
            className="flex flex-col text-left py-1"
          >
            <div className="flex px-2 flex-col">
              <div>
                {subject}:{teacher.fullName}
              </div>

              <div>{teacher.email}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
