import { useEffect, useRef } from "react";

//Partially based on https://github.com/streamich/react-use/blob/master/src/useInterval.ts

export const useInterval = (callback: () => void, delay?: number | null) => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const savedCallback = useRef<typeof callback>(() => {});

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const intervalId = setInterval(tick, delay || 0);
      return () => clearInterval(intervalId);
    }
  }, [delay]);
};
