"use client";

import { useEffect, useRef } from "react";

export function useAutoSave<T>(
  data: T,
  saveFn: (data: T) => Promise<boolean>,
  delayMs = 2000,
  enabled = true
) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSaved = useRef<string>("");
  const saving = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    const serialized = JSON.stringify(data);
    if (serialized === lastSaved.current) return;

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      if (saving.current) return;
      saving.current = true;
      const ok = await saveFn(data);
      if (ok) lastSaved.current = serialized;
      saving.current = false;
    }, delayMs);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [data, saveFn, delayMs, enabled]);
}
