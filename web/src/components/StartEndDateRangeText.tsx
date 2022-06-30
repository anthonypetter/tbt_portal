import { NormalizedDateText } from "./NormalizedDateText";

export function StartEndDateRangeText({
  startDateMs,
  endDateMs,
}: {
  startDateMs?: number;
  endDateMs?: number;
}) {
  return (
    <>
      {startDateMs ? (
        <NormalizedDateText timeMs={startDateMs} />
      ) : (
        "Start date unspecified"
      )}

      <span className="mx-1"> - </span>

      {endDateMs ? (
        <NormalizedDateText timeMs={endDateMs} />
      ) : (
        "End date unspecified"
      )}
    </>
  );
}
