export function getErrorMsg(action: () => void): string | undefined {
  let errorMessage;

  try {
    action();
  } catch (error: unknown) {
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = "Unknown Failure";
    }
  }

  return errorMessage;
}
