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
  unsupportedTimezone = "The given time zone is not supported at this time.",
  unsupportedEmailFormat = "The given email format is not supported.",
  missingTeacherName = "Unable to parse a teacher's name.",
  missingTeacherEmail = "Unable to parse a teacher's email.",
  invalidStartEndDates = "Unable to detect start/end dates.",
}
