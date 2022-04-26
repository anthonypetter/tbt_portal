export function assertUnreachable(x: never, name?: string): never {
  const errorString = `unreachable assertion failure${
    name ? `: ${name}` : `.`
  }`;

  throw new Error(errorString);
}

export function fromJust<T>(t: T | null | undefined, nameForError?: string): T {
  if (t === null || t === undefined) {
    const errorString = `Unexpected undefined/null value${
      nameForError == null ? "" : `: ${nameForError}`
    }`;

    throw new Error(errorString);
  }

  return t;
}
