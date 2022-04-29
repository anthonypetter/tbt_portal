import { ApolloQueryResult } from "@apollo/client";
import { NotFoundError } from "./errors";

export function processResult<T, D>(
  result: ApolloQueryResult<T>,
  accessor: (data: T) => D | null | undefined
): D {
  if (result.errors) {
    console.error(result.errors);
    throw new Error("Unexpected error performing server-side fetch.");
  }

  const data = accessor(result.data);

  if (data === null || data === undefined) {
    console.log("data is null. throwing not found error");
    throw new NotFoundError();
  }

  return data;
}
