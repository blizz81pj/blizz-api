import { GOLF_API_BASE_URL as API_BASE } from "@/lib/api";

export type RoundSummary = {
  roundId: number;
  roundDate: string;
  dateInserted: string;
  course: string;
  teeType: string | null;
  score: number;
  frontNine: number | null;
  backNine: number | null;
  putts: number;
  eagles: number;
  birdies: number;
  pars: number;
  bogeys: number;
  doubleBogeys: number;
  tripleOrMore: number;
};

export type PagedResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

export type SortOrder = "asc" | "desc";

export type RoundSortField = "date" | "score" | "frontNine" | "backNine" | "putts";

export async function fetchRoundsSummary({
  sortBy = "date",
  sortOrder = "desc",
  page = 0,
  size = 20,
  course,
  startDate,
  endDate,
}: {
  sortBy?: RoundSortField;
  sortOrder?: SortOrder;
  page?: number;
  size?: number;
  course?: string;
  startDate?: string;
  endDate?: string;
} = {}): Promise<PagedResponse<RoundSummary>> {
  const params = new URLSearchParams({
    sortBy,
    sortOrder,
    page: String(page),
    size: String(size),
  });
  if (course) params.set("course", course);
  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);

  const response = await fetch(
    `${API_BASE}/api/golf-scores/rounds-summary?${params}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    const message = (await response.text()) || response.statusText;
    throw new Error(`${response.status}: ${message}`);
  }

  return response.json();
}
