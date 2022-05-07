import { useEffect, useRef } from "react";

/**
 * Utility for Modals
 */
export function useResetOnShow(show: boolean, reset: () => void) {
  const savedReset = useRef<typeof reset>(() => undefined);

  useEffect(() => {
    savedReset.current = reset;
  }, [reset]);

  useEffect(() => {
    if (show) {
      savedReset.current();
    }
  }, [show]);
}
