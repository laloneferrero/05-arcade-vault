"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { GAMES, formatScore, getGame, seededScores } from "@/lib/data";
import { useAuth } from "./auth-provider";

export function HallOfFame() {
  const { user } = useAuth();
  const [tab, setTab] = useState(GAMES[0].id);
  const rows = useMemo(() => seededScores(tab.length * 23 + 7, 12), [tab]);
  const game = getGame(tab)!;
  const youRank = 8 + (tab.length % 4);
  const youScore = rows[5].score - 2400;
  const podium = [
    { cls: "silver", row: rows[1], n: "02" },
    { cls: "gold", row: rows[0], n: "01" },
    { cls: "bronze", row: rows[2], n: "03" },
  ];

  return (
    <div className="av-hall fade-in">
      <div className="hall-head">
        <h1>SALÓN DE LA FAMA</h1>
        <p className="pixel" style={{ fontSize: 10 }}>LOS NOMBRES QUE NUNCA SE BORRAN DE LA PANTALLA</p>
      </div>

      <div className="hall-tabs">
        {GAMES.map((g) => (
          <button key={g.id} className={"chip" + (tab === g.id ? " active" : "")} onClick={() => setTab(g.id)}>
            {g.title}
          </button>
        ))}
      </div>

      <div className="podium">
        {podium.map(({ cls, row, n }) => (
          <div key={cls} className={"podium-slot " + cls}>
            {cls === "gold" && (
              <div className="pixel" style={{ fontSize: 9, color: "var(--gold)", letterSpacing: "0.18em" }}>CAMPEÓN</div>
            )}
            <div className="rank-num" style={cls === "gold" ? { fontSize: 36, marginTop: 4 } : undefined}>{n}</div>
            <div className="name">{row.name}</div>
            <div className="score" style={cls === "gold" ? { fontSize: 20 } : undefined}>{formatScore(row.score)}</div>
            <div className="date">{row.date}</div>
          </div>
        ))}
      </div>

      <div className="hall-table">
        <div className="th">
          <div>RANGO</div>
          <div>JUGADOR</div>
          <div>PUNTUACIÓN</div>
          <div>FECHA</div>
        </div>
        {rows.map((r, i) => (
          <div
            key={r.name + i}
            className={"tr" + (i === 0 ? " top1" : i === 1 ? " top2" : i === 2 ? " top3" : "")}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="rk">#{String(r.rank).padStart(2, "0")}</div>
            <div className="pl">{r.name}</div>
            <div className="sc">{formatScore(r.score)}</div>
            <div className="dt">{r.date}</div>
          </div>
        ))}
        {user && (
          <>
            <div className="tr you-label">▸ TU MEJOR MARCA EN {game.title}</div>
            <div className="tr you" style={{ animationDelay: `${rows.length * 50 + 50}ms` }}>
              <div className="rk" style={{ color: "var(--yellow)" }}>#{String(youRank).padStart(2, "0")}</div>
              <div className="pl" style={{ color: "var(--yellow)" }}>{user.name}</div>
              <div className="sc" style={{ color: "var(--yellow)", textShadow: "0 0 6px rgba(245,255,0,0.5)" }}>{formatScore(youScore)}</div>
              <div className="dt">11/05/2026</div>
            </div>
          </>
        )}
      </div>

      <div style={{ textAlign: "center", marginTop: 32 }}>
        <Link href="/" className="btn lg">VOLVER A LA BIBLIOTECA</Link>
      </div>
    </div>
  );
}
