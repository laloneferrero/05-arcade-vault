import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GamePlayer } from "@/components/game-player";
import { GAMES, getGame } from "@/lib/data";

export function generateStaticParams() {
  return GAMES.map((g) => ({ id: g.id }));
}

export async function generateMetadata({ params }: PageProps<"/juegos/[id]/jugar">): Promise<Metadata> {
  const game = getGame((await params).id);
  return game ? { title: `Jugando ${game.title} · Arcade Vault` } : {};
}

export default async function PlayPage({ params }: PageProps<"/juegos/[id]/jugar">) {
  const game = getGame((await params).id);
  if (!game) notFound();
  return <GamePlayer game={game} />;
}
