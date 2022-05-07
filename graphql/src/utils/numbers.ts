const BASE = 10;

export function parseId(id: string): number {
  const parsed = parseInt(id, BASE);

  if (!Number.isInteger(parsed)) {
    throw new Error("Invalid id provided. Unable to parse to integer.");
  }

  return parsed;
}
