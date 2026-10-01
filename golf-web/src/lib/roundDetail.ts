import { GOLF_API_BASE_URL } from "@/lib/api";

export type HoleDetail = {
  holeId: number;
  holeNumber: number;
  par: number;
  strokeIndex: number;
  score: number;
  putts: number;
  netScore: number;
  strokesTaken: number;
};

export type RoundDetail = {
  roundId: number;
  course: string;
  teeType: string;
  handicap: number;
  /** Local date-time, e.g. 2026-09-20T12:37:05 */
  dateInserted: string;
  score: number;
  holes: HoleDetail[];
};

export type RoundUpdateRequest = Omit<RoundDetail, "roundId" | "score" | "holes"> & {
  holes: Array<{ [K in keyof HoleDetail]: HoleDetail[K] | null }>;
};

/** Server-side fetch; returns null when the round does not exist. */
export async function fetchRoundDetail(roundId: string): Promise<RoundDetail | null> {
  const response = await fetch(
    `${GOLF_API_BASE_URL}/api/golf-scores/rounds/${encodeURIComponent(roundId)}`,
    { cache: "no-store" },
  );

  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    const message = (await response.text()) || response.statusText;
    throw new Error(`${response.status}: ${message}`);
  }

  return response.json();
}

/** Client-side save through the Next.js proxy route. */
export async function saveRound(
  roundId: number,
  request: RoundUpdateRequest,
): Promise<RoundDetail> {
  const response = await fetch(`/api/golf-scores/rounds/${roundId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const message = (await response.text()) || response.statusText;
    throw new Error(`${response.status}: ${message}`);
  }

  return response.json();
}

export async function deleteRound(roundId: number): Promise<void> {
  const response = await fetch(`/api/golf-scores/rounds/${roundId}`, { method: "DELETE" });

  if (!response.ok) {
    const message = (await response.text()) || response.statusText;
    throw new Error(`${response.status}: ${message}`);
  }
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** "Sunday, September 20, 2026 · 12:37 PM" without timezone conversion. */
export function formatRoundDateTime(value: string): string {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!match) {
    return value;
  }
  const [, year, month, day, hour, minute] = match.map(Number);
  const weekday = WEEKDAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  const meridiem = hour < 12 ? "AM" : "PM";
  return `${weekday}, ${MONTHS[month - 1]} ${day}, ${year} · ${hour12}:${String(minute).padStart(2, "0")} ${meridiem}`;
}

export function formatScoreToPar(value: number): string {
  if (value === 0) return "E";
  return value > 0 ? `+${value}` : `−${Math.abs(value)}`;
}

/** Tailwind classes for a hole score relative to par. */
export function scoreMarkClass(score: number | null, par: number | null): string {
  if (score == null || par == null) return "";
  const diff = score - par;
  if (diff <= -2) return "bg-amber-300 text-amber-950 ring-1 ring-amber-500";
  if (diff === -1) return "bg-emerald-600 text-white";
  if (diff === 0) return "";
  if (diff === 1) return "bg-sky-100 text-sky-900";
  if (diff === 2) return "bg-orange-200 text-orange-950";
  return "bg-red-300 text-red-950";
}

export const SCORE_MARK_LEGEND: Array<{ label: string; score: number; par: number }> = [
  { label: "Eagle or better", score: 2, par: 4 },
  { label: "Birdie", score: 3, par: 4 },
  { label: "Par", score: 4, par: 4 },
  { label: "Bogey", score: 5, par: 4 },
  { label: "Double", score: 6, par: 4 },
  { label: "Triple+", score: 7, par: 4 },
];
