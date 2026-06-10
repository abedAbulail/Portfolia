"use client";

import { useCallback, useRef, useState } from "react";

export function useUndoRedo<T>(initial: T, maxHistory = 50) {
  const [state, setState] = useState(initial);
  const past = useRef<T[]>([]);
  const future = useRef<T[]>([]);

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setState((prev) => {
        const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        past.current = [...past.current.slice(-maxHistory + 1), prev];
        future.current = [];
        return resolved;
      });
    },
    [maxHistory]
  );

  const undo = useCallback(() => {
    setState((current) => {
      const prev = past.current.pop();
      if (!prev) return current;
      future.current = [current, ...future.current];
      return prev;
    });
  }, []);

  const redo = useCallback(() => {
    setState((current) => {
      const next = future.current.shift();
      if (!next) return current;
      past.current = [...past.current, current];
      return next;
    });
  }, []);

  const reset = useCallback((value: T) => {
    past.current = [];
    future.current = [];
    setState(value);
  }, []);

  return {
    state,
    set,
    undo,
    redo,
    canUndo: past.current.length > 0,
    canRedo: future.current.length > 0,
    reset,
  };
}
