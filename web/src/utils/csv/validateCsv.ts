import { ReadStream } from "fs";
import {
  ProcessedCohort,
  parseReadStream,
  parseToCohortRows,
  processCohortRow,
} from "./parseCsv";
import { CsvValidationError, CsvValidationErrorMessage } from "@utils/errors";

type ValidationResult = {
  errors: { message: string; hint?: string }[];
  csv?: ProcessedCohort[];
};

export async function validateCsvFile(
  data: ReadStream
): Promise<ValidationResult> {
  try {
    const csv = await parseReadStream(data);
    return validateCsv(csv);
  } catch (error: unknown) {
    if (
      error instanceof RangeError &&
      error.message === "Row length does not match headers"
    ) {
      return {
        errors: [{ message: CsvValidationErrorMessage.rowLengthMismatch }],
      };
    }

    return {
      errors: [{ message: CsvValidationErrorMessage.unexpectedParseError }],
    };
  }
}

export function validateCsv(unvalidatedCsv: unknown): ValidationResult {
  try {
    const cohortRows = parseToCohortRows(unvalidatedCsv);
    const processedCsv = processCohortRow(cohortRows);
    return { csv: processedCsv, errors: [] };
  } catch (error: unknown) {
    const errors = [];
    if (error instanceof CsvValidationError) {
      errors.push({ message: error.message, hint: error.hint });
    } else {
      errors.push({ message: CsvValidationErrorMessage.invalidFormat });
    }

    return { errors };
  }
}
