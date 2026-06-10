"use client";

import { useEffect, useRef, useState } from "react";

function parseStatValue(value: string): { num: number; suffix: string } {
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return { num: 0, suffix: value };
  return { num: parseFloat(match[1]), suffix: match[2] };
}

export default function CountUp({
  value,
  className = "",
  style,
  glow = false,
}: {
  value: string;
  className?: string;
  style?: React.CSSProperties;
  glow?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const { num, suffix } = parseStatValue(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || num === 0) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let started = false;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        obs.disconnect();
        const duration = 1200;
        const start = performance.now();
        function tick(now: number) {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setDisplay(`${Math.round(num * eased)}${suffix}`);
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [num, suffix]);

  return (
    <span ref={ref} className={`${glow ? "pf-stat-glow" : ""} ${className}`} style={style}>
      {display}
    </span>
  );
}
