import { AssignmentSubject } from "@generated/graphql";
import { numberifyTime, Time, TIME_REGEX } from "@utils/dateTime";
import { CsvValidationError, CsvValidationErrorMessage } from "@utils/errors";
import csv from "csv-parser";
import { ReadStream } from "fs";
import isEmail from "isemail";
import difference from "lodash/difference";

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

export type SubjectSchedule = {
  subject: AssignmentSubject;
  startTime: Time;
  endTime: Time;
  timeZone: SupportedIanaTimeZone;
};

export type StaffAssignment = {
  subject: AssignmentSubject;
  teacher: { fullName: string; email: string };
};

export type ProcessedCohort = {
  cohortName: string;
  grade: string;
  googleClassroomLink?: string;
  cohortStartDate: number;
  cohortEndDate: number;

  monday: SubjectSchedule[];
  tuesday: SubjectSchedule[];
  wednesday: SubjectSchedule[];
  thursday: SubjectSchedule[];
  friday: SubjectSchedule[];
  saturday: SubjectSchedule[];
  sunday: SubjectSchedule[];

  staffAssignments: StaffAssignment[];
};

export async function parseCsv({
  data,
  startDate,
  endDate,
}: {
  data: ReadStream;
  startDate: Date;
  endDate: Date;
}) {
  const genericObject = await parseReadStream(data);
  const cohortRows = parseToCohortRows(genericObject);
  return processCohortRow({ csv: cohortRows, startDate, endDate });
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
  // have the keys enumerated in the `RequiredHeaders` enum.
  return csv as CohortCsvRow[];
}

export function processCohortRow({
  csv,
  startDate,
  endDate,
}: {
  csv: CohortCsvRow[];
  startDate: Date;
  endDate: Date;
}): ProcessedCohort[] {
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
      cohortStartDate: startDate.getTime(),
      cohortEndDate: endDate.getTime(),

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
    const [timeRange, timeZone] = timeAndZone.split(" ");
    const [startTimeString, endTimeString] = timeRange.split("-");
    const startTime = numberifyTime(parseHhMm(startTimeString));
    const endTime = numberifyTime(parseHhMm(endTimeString));

    return {
      subject: parseSubject(subject),
      startTime,
      endTime,
      timeZone: parseTimeZone(timeZone),
    };
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

  if (!fullName) {
    throw new CsvValidationError(
      CsvValidationErrorMessage.missingTeacherName,
      email
    );
  }

  if (!email) {
    throw new CsvValidationError(
      CsvValidationErrorMessage.missingTeacherEmail,
      email
    );
  }

  try {
    if (!isEmail.validate(email)) {
      throw new CsvValidationError(
        CsvValidationErrorMessage.unsupportedEmailFormat,
        email
      );
    }
  } catch (error) {
    throw new CsvValidationError(
      CsvValidationErrorMessage.unsupportedEmailFormat,
      email
    );
  }

  return { fullName, email };
}

function parseSubject(subject: string) {
  switch (subject.toLowerCase()) {
    case "math":
      return AssignmentSubject.Math;

    case "ela":
      return AssignmentSubject.Ela;

    case "gen":
    case "general":
      return AssignmentSubject.General;

    default:
      throw new CsvValidationError(
        CsvValidationErrorMessage.unrecognizedSubject,
        subject
      );
  }
}

export function parseHhMm(time: string) {
  const isValid = TIME_REGEX.test(time);

  if (isValid) {
    return time;
  }

  throw new CsvValidationError(
    CsvValidationErrorMessage.invalidTimeFormat,
    time
  );
}

export enum SupportedIanaTimeZone {
  PacificPagoPago = "Pacific/Pago_Pago",
  PacificHonolulu = "Pacific/Honolulu",
  AmericaAnchorage = "America/Anchorage",
  AmericaLosAngeles = "America/Los_Angeles",
  AmericaPhoenix = "America/Phoenix",
  AmericaDenver = "America/Denver",
  AmericaChicago = "America/Chicago",
  AmericaNewYork = "America/New_York",
  AmericaPuertoRico = "America/Puerto_Rico",
  PacificGuam = "Pacific/Guam",
}

function parseTimeZone(timeZone: string) {
  switch (timeZone) {
    case "SST":
    case "Pacific/Pago_Pago":
      return SupportedIanaTimeZone.PacificPagoPago;

    case "HT":
    case "HST":
    case "Pacific/Honolulu":
      return SupportedIanaTimeZone.PacificHonolulu;

    case "AKST":
    case "AKDT":
    case "AKT":
    case "America/Anchorage":
      return SupportedIanaTimeZone.AmericaAnchorage;

    case "PST":
    case "PDT":
    case "PT":
    case "America/Los_Angeles":
      return SupportedIanaTimeZone.AmericaLosAngeles;

    case "PHX":
    case "America/Phoenix":
      return SupportedIanaTimeZone.AmericaPhoenix;

    case "MST":
    case "MDT":
    case "MT":
    case "America/Denver":
      return SupportedIanaTimeZone.AmericaDenver;

    case "CST":
    case "CDT":
    case "CT":
    case "America/Chicago":
      return SupportedIanaTimeZone.AmericaChicago;

    case "EST":
    case "EDT":
    case "ET":
    case "America/New_York":
      return SupportedIanaTimeZone.AmericaNewYork;

    case "AST":
    case "America/Puerto_Rico":
      return SupportedIanaTimeZone.AmericaPuertoRico;

    case "ChST":
    case "Pacific/Guam":
      return SupportedIanaTimeZone.PacificGuam;

    default:
      throw new CsvValidationError(
        CsvValidationErrorMessage.unsupportedTimezone,
        timeZone
      );
  }
}
