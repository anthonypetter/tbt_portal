export class ApplicationError extends Error {
  public originalError?: Error;

  constructor(message: string, originalError?: Error) {
    super(message);
    this.name = this.constructor.name;
    this.originalError = originalError;
  }
}

export class ValidationError extends ApplicationError {
  public reason?: string;

  constructor(
    message = "A validation error occurred",
    cause?: string,
    originalError?: Error
  ) {
    super(message, originalError);
    this.name = this.constructor.name;
    this.reason = cause;
  }
}
