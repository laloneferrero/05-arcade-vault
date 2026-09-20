"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { formatScore, type Game } from "@/lib/data";

const BTN_VARIANT = { magenta: "magenta", yellow: "yellow", cyan: "", green: "" } as const;

export function GameCard({ game }: { game: Game }) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const href = `/juegos/${game.id}`;

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `translateY(-6px) rotateX(${-py * 6}deg) rotateY(${px * 8}deg)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div
      ref={ref}
      className="card"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={() => router.push(href)}
    >
      <div className="cover">
        <div className={"cover-bg " + game.cover}></div>
        <div className="label">{game.cat}</div>
      </div>
      <div className="meta">
        <div className="title">{game.title}</div>
        <div className="desc">{game.short}</div>
        <div className="row">
          <div className="score-badge">
            <span>MEJOR PUNTUACIÓN</span>
            <b>{formatScore(game.best)}</b>
          </div>
          <button
            className={"btn " + BTN_VARIANT[game.color]}
            onClick={(e) => {
              e.stopPropagation();
              router.push(href);
            }}
          >
            JUGAR
          </button>
        </div>
      </div>
    </div>
  );
}
