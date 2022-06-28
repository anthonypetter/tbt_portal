import { CsvValidationError, CsvValidationErrorMessage } from "@utils/errors";
import { parseInteger } from "@utils/numbers";
import isValid from "date-fns/isValid";
import { ReadStream } from "fs";
import { isString } from "lodash";
import {
  parseReadStream,
  parseToCohortRows,
  processCohortRow,
  ProcessedCohort,
} from "./parseCsv";

type ValidationResult = {
  errors: { message: string; hint?: string }[];
  csv?: ProcessedCohort[];
};

export async function validate({
  startDate: startDateRaw,
  endDate: endDateRaw,
  data,
}: {
  startDate: unknown;
  endDate: unknown;
  data: ReadStream;
}): Promise<ValidationResult> {
  try {
    const { startDate, endDate } = parseDates(startDateRaw, endDateRaw);
    return validateCsvFile({ data, startDate, endDate });
  } catch (error: unknown) {
    if (error instanceof CsvValidationError) {
      return { errors: [{ message: error.message, hint: error.hint }] };
    } else {
      return {
        errors: [{ message: CsvValidationErrorMessage.unexpectedParseError }],
      };
    }
  }
}

export async function validateCsvFile({
  startDate,
  endDate,
  data,
}: {
  startDate: Date;
  endDate: Date;
  data: ReadStream;
}): Promise<ValidationResult> {
  try {
    const csv = await parseReadStream(data);
    return validateCsv({ unvalidatedCsv: csv, startDate, endDate });
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

export function parseDates(startDateRaw: unknown, endDateRaw: unknown) {
  if (
    !isString(startDateRaw) ||
    !isString(endDateRaw) ||
    startDateRaw === "null" ||
    endDateRaw === "null"
  ) {
    throw new CsvValidationError(
      CsvValidationErrorMessage.invalidStartEndDates,
      "Engagement start and end dates must be specified to create a cohort."
    );
  }

  const startDate = new Date(parseInteger(startDateRaw));
  const endDate = new Date(parseInteger(endDateRaw));

  if (!isValid(startDate) || !isValid(endDate)) {
    throw new CsvValidationError(
      CsvValidationErrorMessage.invalidStartEndDates,
      "Engagement start and end dates must be specified to create a cohort."
    );
  }

  return { startDate, endDate };
}

export function validateCsv({
  unvalidatedCsv,
  startDate,
  endDate,
}: {
  unvalidatedCsv: unknown;
  startDate: Date;
  endDate: Date;
}): ValidationResult {
  try {
    const cohortRows = parseToCohortRows(unvalidatedCsv);
    const processedCsv = processCohortRow({
      csv: cohortRows,
      startDate,
      endDate,
    });
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
