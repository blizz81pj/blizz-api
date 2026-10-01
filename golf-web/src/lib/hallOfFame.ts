import { GOLF_API_BASE_URL as API_BASE } from "@/lib/api";
import type { PagedResponse, SortOrder } from "@/lib/roundSummary";

export type TopRound = {
  roundId: number;
  roundDate: string;
  dateInserted: string;
  course: string;
  teeType: string | null;
  par: number;
  score: number;
  toPar: number;
};

export type EagleHole = {
  holeId: number;
  roundId: number;
  roundDate: string;
  dateInserted: string;
  course: string;
  holeNumber: number;
  par: number;
  score: number;
  putts: number;
};

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}/api/golf-scores${path}`, { cache: "no-store" });
  if (!response.ok) {
    const message = (await response.text()) || response.statusText;
    throw new Error(`${response.status}: ${message}`);
  }
  return response.json();
}

export function fetchTopRounds(limit = 10): Promise<TopRound[]> {
  return getJson(`/hall-of-fame/top-rounds?limit=${limit}`);
}

export function fetchEagles({
  sortOrder = "desc",
  page = 0,
  size = 20,
}: {
  sortOrder?: SortOrder;
  page?: number;
  size?: number;
} = {}): Promise<PagedResponse<EagleHole>> {
  const params = new URLSearchParams({ sortOrder, page: String(page), size: String(size) });
  return getJson(`/hall-of-fame/eagles?${params}`);
}

export function formatRoundToPar(toPar: number): string {
  if (toPar === 0) return "E";
  return toPar > 0 ? `+${toPar}` : `−${Math.abs(toPar)}`;
}

/** Name for a hole scored two or more under par. */
export function eagleResultLabel(par: number, score: number): string {
  if (score === 1) return "Hole-in-one";
  const underPar = par - score;
  if (underPar >= 4) return "Condor";
  if (underPar === 3) return "Albatross";
  return "Eagle";
}

/**
 * Competition ranking (1, 2, 2, 4) so rounds with the same score-to-par share a place.
 * Expects rounds already sorted by toPar ascending.
 */
export function rankByToPar(rounds: TopRound[]): number[] {
  return rounds.map((round) => rounds.findIndex((other) => other.toPar === round.toPar) + 1);
}
