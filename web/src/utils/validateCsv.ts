import { difference } from "lodash";
import { ReadStream } from "fs";
import csv from "csv-parser";

enum Headers {
  CohortName = "cohort",
  Grade = "grade",
  Subjects = "subjects",
  Sunday = "sunday",
  Monday = "monday",
  Tuesday = "tuesday",
  Wednesday = "wednesday",
  Thursday = "thursday",
  Friday = "friday",
  Saturday = "saturday",
  GoogleClassroomLink = "google classroom link",
  Subject = "subject",
  Math = "math",
  Ela = "ela",
}

type ValidationResult = {
  errors: { message: string; hint?: string }[];
};

export enum CsvValidationError {
  emptyData = "Invalid CSV: Dataset is empty.",
  invalidFormat = "Unable to detect format.",
  missingColumn = "One or more of the required column headers is missing.",
  rowLengthMismatch = "Row length does not match headers.",
  unexpectedParseError = "An unexpected error was encountered during CSV parsing.",
}

export function validateCsv(csv: unknown): ValidationResult {
  if (!Array.isArray(csv)) {
    return { errors: [{ message: CsvValidationError.invalidFormat }] };
  }

  if (csv.length === 0) {
    return { errors: [{ message: CsvValidationError.emptyData }] };
  }

  const headers = Object.keys(csv[0]);
  const expectedHeaders = Object.values(Headers);
  const diffResult = difference(headers, expectedHeaders);
  console.log("diffResult", diffResult);

  if (diffResult.length > 0) {
    return {
      errors: [
        {
          message: CsvValidationError.missingColumn,
          hint: diffResult.join(","),
        },
      ],
    };
  }

  // At this point, we know our CSV is an array of row objects that
  // have the keys enumerated in the `Headers` enum.
  const csvRows = csv as { [key in Headers]: string }[];
  //TODO: dig into data.

  return { errors: [] };
}

export async function validateCsvFile(data: ReadStream) {
  try {
    const csv = await parseCsv(data);
    return validateCsv(csv);
  } catch (error: unknown) {
    if (
      error instanceof RangeError &&
      error.message === "Row length does not match headers"
    ) {
      return {
        errors: [{ message: CsvValidationError.rowLengthMismatch }],
      };
    }

    return {
      errors: [{ message: CsvValidationError.unexpectedParseError }],
    };
  }
}

async function parseCsv(data: ReadStream): Promise<Record<string, string>[]> {
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
