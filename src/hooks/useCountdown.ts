import { useEffect, useRef } from "react";

export function useCountdown(
  active: boolean,
  onTick: () => void,
  intervalMs: number = 1000
) {
  const onTickRef = useRef(onTick);
  onTickRef.current = onTick;

  useEffect(() => {
    if (!active) return;

    const id = setInterval(() => {
      onTickRef.current();
    }, intervalMs);

    return () => clearInterval(id);
  }, [active, intervalMs]);
}
