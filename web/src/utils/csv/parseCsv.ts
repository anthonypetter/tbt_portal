import csv from "csv-parser";
import { ReadStream } from "fs";
import difference from "lodash/difference";
import isEmail from "isemail";
import { AssignmentSubject } from "@generated/graphql";
import { CsvValidationError, CsvValidationErrorMessage } from "@utils/errors";

const NONE = "none";

export enum RequiredHeaders {
  CohortName = "cohort",
  Grade = "grade",
  Sunday = "sunday",
  Monday = "monday",
  Tuesday = "tuesday",
  Wednesday = "wednesday",
  Thursday = "thursday",
  Friday = "friday",
  Saturday = "saturday",
}

enum OptionalHeaders {
  /**
   * These two subject columns are being provided in the legacy CSV
   * but I find them to be redundant. I will infer the subjects from
   * the schedule and teacher-assignment cells.
   */
  Subject = "subject",
  Subjects = "subjects",
  GoogleClassroomLink = "google classroom link",
  Math = "math",
  Ela = "ela",
  General = "gen",
}

export type CohortCsvRow = { [key in RequiredHeaders]: string } & {
  [key in OptionalHeaders]?: string;
};

type SubjectSchedule = {
  subject: string;
  startTime: string;
  endTime: string;
  timezone: string;
};

type StaffAssignments = {
  subject: AssignmentSubject;
  teacher: { fullName: string; email: string };
};

type ProcessedCohort = {
  cohortName: string;
  grade: string;
  googleClassroomLink?: string;

  monday: SubjectSchedule[];
  tuesday: SubjectSchedule[];
  wednesday: SubjectSchedule[];
  thursday: SubjectSchedule[];
  friday: SubjectSchedule[];
  saturday: SubjectSchedule[];
  sunday: SubjectSchedule[];

  staffAssignments: StaffAssignments[];
};

export async function parseCsv(data: ReadStream) {
  const genericObject = await parseReadStream(data);
  const cohortRows = parseToCohortRows(genericObject);
  return processCohortRow(cohortRows);
}

export async function parseReadStream(
  data: ReadStream
): Promise<Record<string, string>[]> {
  return new Promise((resolve, reject) => {
    const results: Record<string, string>[] = [];

    data
      .pipe(
        csv({ mapHeaders: ({ header }) => header.toLowerCase(), strict: true })
      )
      .on("data", (data) => results.push(data))
      .on("error", (error) => reject(error))
      .on("end", () => {
        return resolve(results);
      });
  });
}

export function parseToCohortRows(csv: unknown): CohortCsvRow[] {
  if (!Array.isArray(csv)) {
    throw new CsvValidationError(CsvValidationErrorMessage.invalidFormat);
  }

  if (csv.length === 0) {
    throw new CsvValidationError(CsvValidationErrorMessage.emptyData);
  }

  const headers = Object.keys(csv[0]);
  const requiredHeaders = Object.values(RequiredHeaders);
  const missingRequiredHeaders = difference(requiredHeaders, headers);

  if (missingRequiredHeaders.length > 0) {
    throw new CsvValidationError(
      CsvValidationErrorMessage.missingRequiredColumn,
      `Columns: ${missingRequiredHeaders.join(", ")}`
    );
  }

  // At this point, we know our CSV is an array of row objects that
  // have the keys enumerated in the `Headers` enum.
  return csv as CohortCsvRow[];
}

export function processCohortRow(csv: CohortCsvRow[]): ProcessedCohort[] {
  const processedRows = csv.map((cohortRow) => {
    const googleClassroomLink = cohortRow["google classroom link"];

    return {
      cohortName: cohortRow.cohort,
      grade: cohortRow.grade,
      googleClassroomLink:
        googleClassroomLink?.toLowerCase() === null ||
        googleClassroomLink?.toLowerCase() === NONE
          ? undefined
          : googleClassroomLink,

      monday: parseSubjectSchedules(cohortRow.monday),
      tuesday: parseSubjectSchedules(cohortRow.tuesday),
      wednesday: parseSubjectSchedules(cohortRow.wednesday),
      thursday: parseSubjectSchedules(cohortRow.thursday),
      friday: parseSubjectSchedules(cohortRow.friday),
      saturday: parseSubjectSchedules(cohortRow.saturday),
      sunday: parseSubjectSchedules(cohortRow.sunday),

      staffAssignments: parseStaffAssignments(cohortRow),
    };
  });

  return processedRows;
}

function parseSubjectSchedules(csvDayInput: string): SubjectSchedule[] {
  if (csvDayInput.toLowerCase() === NONE) {
    return [];
  }

  const subjectTimeRanges = csvDayInput.split(";");

  const subjectSchedule = subjectTimeRanges.map((subjectRange) => {
    const [subject, ...restTime] = subjectRange.split(":");
    const timeAndZone = restTime.join(":");
    const [timeRange, timezone] = timeAndZone.split(" ");
    const [startTime, endTime] = timeRange.split("-");
    return { subject, startTime, endTime, timezone };
  });

  return subjectSchedule;
}

function parseStaffAssignments(row: CohortCsvRow) {
  const staff = [];

  if (row.ela) {
    staff.push({
      subject: AssignmentSubject.Ela,
      teacher: parseTeacher(row.ela),
    });
  }

  if (row.math) {
    staff.push({
      subject: AssignmentSubject.Math,
      teacher: parseTeacher(row.math),
    });
  }

  if (row.gen) {
    staff.push({
      subject: AssignmentSubject.General,
      teacher: parseTeacher(row.gen),
    });
  }

  return staff;
}

function parseTeacher(tupleString: string): {
  fullName: string;
  email: string;
} {
  const [fullName, email] = tupleString.split(";");
  if (!isEmail.validate(email)) {
    throw new Error(`Invalid email: ${email}`);
  }
  return { fullName, email };
}
