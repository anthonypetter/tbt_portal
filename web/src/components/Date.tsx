import React from "react";

type Props = {
  timeMs: number | null | undefined;
};

export function DateText({ timeMs }: Props) {
  if (!timeMs) {
    return <span>&#8212;</span>;
  }

  const date = new Date(timeMs);
  return <span>{date.toLocaleDateString()}</span>;
}
