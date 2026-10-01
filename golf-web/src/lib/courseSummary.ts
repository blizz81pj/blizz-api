export type HoleScoringSummary = {
  holeNumber: number;
  par: number;
  timesPlayed: number;
  averageScore: number;
  averageToPar: number;
  averagePutts: number;
  eagles: number;
  birdies: number;
  pars: number;
  bogeys: number;
  doubleBogeys: number;
  tripleOrMore: number;
};

export type HoleSortOption = "holeNumber" | "averageAsc" | "averageDesc";

export const HOLE_SORT_OPTIONS: Array<{ value: HoleSortOption; label: string }> = [
  { value: "holeNumber", label: "Hole number (1-18)" },
  { value: "averageAsc", label: "Scoring average (best first)" },
  { value: "averageDesc", label: "Scoring average (worst first)" },
];

const SORT_PARAMS: Record<HoleSortOption, { sortBy: string; sortOrder: string }> = {
  holeNumber: { sortBy: "holeNumber", sortOrder: "asc" },
  averageAsc: { sortBy: "averageToPar", sortOrder: "asc" },
  averageDesc: { sortBy: "averageToPar", sortOrder: "desc" },
};

export async function fetchCourseHoleSummary(
  course: string,
  sort: HoleSortOption,
): Promise<HoleScoringSummary[]> {
  const params = new URLSearchParams({ course, ...SORT_PARAMS[sort] });
  const response = await fetch(`/api/golf-scores/course-hole-summary?${params}`);

  if (!response.ok) {
    const message = (await response.text()) || response.statusText;
    throw new Error(`${response.status}: ${message}`);
  }

  return response.json();
}

export function formatToPar(value: number): string {
  if (Math.abs(value) < 0.005) {
    return "E";
  }
  return value > 0 ? `+${value.toFixed(2)}` : `−${Math.abs(value).toFixed(2)}`;
}

/**
 * Hue for a scoring average relative to par: par or better is green,
 * +1 is yellow, +2 or worse is red.
 */
function toParHue(value: number): number {
  const GREEN = 140;
  const YELLOW = 50;
  const RED = 0;
  if (value <= 0) {
    return GREEN;
  }
  if (value <= 1) {
    return GREEN - (GREEN - YELLOW) * value;
  }
  if (value <= 2) {
    return YELLOW - (YELLOW - RED) * (value - 1);
  }
  return RED;
}

export function toParColors(value: number): { background: string; color: string } {
  const hue = Math.round(toParHue(value));
  return {
    background: `hsl(${hue} 75% 82%)`,
    color: `hsl(${hue} 70% 20%)`,
  };
}
