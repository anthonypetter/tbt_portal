export class NotFoundError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class CsvValidationError extends Error {
  public hint?: string;
  constructor(message: string, hint?: string) {
    super(message);
    this.name = "CsvValidationError";
    this.hint = hint;
  }
}

export enum CsvValidationErrorMessage {
  emptyData = "Invalid CSV: Dataset is empty.",
  invalidFormat = "Unable to detect format.",
  missingRequiredColumn = "One or more of the required column headers is missing.",
  rowLengthMismatch = "Row length does not match headers.",
  unexpectedParseError = "An unexpected error was encountered during CSV parsing.",
  unrecognizedSubject = "Encountered an unrecognized subject.",
  invalidTimeFormat = "Unable to parse provided time.",
  invalidTimeZone = "Unable to parse provided time zone.",
}
