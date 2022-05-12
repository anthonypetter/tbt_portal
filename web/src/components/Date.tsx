import React from "react";

type Props = {
  timeMs: number | null | undefined;
};

export function DateText({ timeMs }: Props) {
  if (!timeMs) {
    return <>{"&ndash"}</>;
  }

  const date = new Date(timeMs);
  return <>{date.toLocaleDateString()}</>;
}
