"use client";

import { useEffect, useRef, useState } from "react";
import type { PortfolioTheme } from "@/lib/portfolio-theme";

export function HeroParticles({ theme, count = 40 }: { theme: PortfolioTheme; count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let animId: number;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 2.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.0008,
      dy: (Math.random() - 0.5) * 0.0008,
      alpha: Math.random() * 0.5 + 0.3,
    }));

    function resize() {
      canvas!.width = canvas!.offsetWidth;
      canvas!.height = canvas!.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      for (const p of particles) {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > 1) p.dx *= -1;
        if (p.y < 0 || p.y > 1) p.dy *= -1;
        ctx!.beginPath();
        ctx!.arc(p.x * canvas!.width, p.y * canvas!.height, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `${theme.colors.primary}${Math.round(p.alpha * 255).toString(16).padStart(2, "0")}`;
        ctx!.fill();
      }
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [theme.colors.primary, count]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden />;
}

export function HeroWaves({ theme }: { theme: PortfolioTheme }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-28 overflow-hidden pointer-events-none" aria-hidden>
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full pf-wave-1" style={{ opacity: 0.45 }}>
        <path d="M0,60 C300,120 600,0 900,60 C1050,90 1150,30 1200,60 L1200,120 L0,120 Z" fill={theme.colors.primary} />
      </svg>
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full pf-wave-2" style={{ opacity: 0.3 }}>
        <path d="M0,80 C400,40 800,100 1200,70 L1200,120 L0,120 Z" fill={theme.colors.accent} />
      </svg>
    </div>
  );
}

export function HeroAurora({ theme, multi = false }: { theme: PortfolioTheme; multi?: boolean }) {
  const g1 = theme.colors.primary;
  const g2 = theme.colors.accent;
  const g3 = multi ? "#4ade80" : g2;
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      aria-hidden
      style={{
        background: multi
          ? `radial-gradient(ellipse at 20% 50%, ${g1}45 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, ${g2}35 0%, transparent 45%), radial-gradient(ellipse at 60% 80%, ${g3}30 0%, transparent 40%)`
          : `radial-gradient(ellipse at 20% 50%, ${g1}40 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, ${g2}35 0%, transparent 45%)`,
        animation: "aurora-shift 15s ease-in-out infinite alternate",
      }}
    />
  );
}

export function TypewriterName({ name, theme }: { name: string; theme: PortfolioTheme }) {
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { setText(name); setDone(true); return; }
    let i = 0;
    const interval = setInterval(() => {
      if (i <= name.length) { setText(name.slice(0, i)); i++; }
      else { setDone(true); clearInterval(interval); }
    }, 70);
    return () => clearInterval(interval);
  }, [name]);

  return (
    <span>
      {text}
      {!done && <span className="inline-block w-0.5 h-[1em] ml-1 animate-pulse" style={{ background: theme.colors.primary }} />}
    </span>
  );
}

export function HeroCard3D({ children, theme, radius }: { children: React.ReactNode; theme: PortfolioTheme; radius: string }) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(1000px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`;
  }

  function onLeave() {
    if (ref.current) ref.current.style.transform = "perspective(1000px) rotateY(0) rotateX(0)";
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`pf-glass-card transition-transform duration-200 border p-8 ${radius}`}
      style={{ background: `${theme.colors.surface}cc`, boxShadow: `0 20px 60px ${theme.colors.primary}20` }}
    >
      {children}
    </div>
  );
}

export function HeroGlow({ type }: { type: "violet-pulse" | "neon" | "blob" | "gradient-shift" | "ice-top" | "sunset" }) {
  const map = {
    "violet-pulse": "pf-glow-violet",
    neon: "pf-glow-neon",
    blob: "pf-glow-blob",
    "gradient-shift": "pf-glow-sunset",
    "ice-top": "pf-glow-ice-top",
    sunset: "pf-glow-sunset",
  };
  return <div className={map[type]} aria-hidden />;
}
