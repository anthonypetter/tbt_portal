const BASE = 10;

export function parseInteger(stringInteger: string): number {
  const parsed = parseInt(stringInteger, BASE);

  if (!Number.isInteger(parsed)) {
    throw new Error("Invalid string. Unable to parse to integer.");
  }

  return parsed;
}
