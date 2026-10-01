import type { RoundSortField, SortOrder } from "@/lib/roundSummary";

export type DateRange = "all" | "last30" | "year" | "custom";

export const DATE_RANGE_OPTIONS: Array<{ value: DateRange; label: string }> = [
  { value: "all", label: "All dates" },
  { value: "last30", label: "Last 30 days" },
  { value: "year", label: "Current calendar year" },
  { value: "custom", label: "Custom range…" },
];

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
export const DEFAULT_PAGE_SIZE = 20;

const SORT_FIELDS: RoundSortField[] = ["date", "score", "frontNine", "backNine", "putts"];
export const DEFAULT_SORT_BY: RoundSortField = "date";
export const DEFAULT_SORT_ORDER: SortOrder = "desc";

/** Direction applied the first time a column is clicked: newest dates first, lowest scores first. */
export function initialSortOrder(field: RoundSortField): SortOrder {
  return field === "date" ? "desc" : "asc";
}

export type RoundFilters = {
  course: string;
  range: DateRange;
  /** yyyy-MM-dd, only used when range is "custom" */
  start: string;
  /** yyyy-MM-dd, only used when range is "custom" */
  end: string;
  /** 1-based */
  page: number;
  size: number;
  sortBy: RoundSortField;
  sortOrder: SortOrder;
};

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function parseRoundFilters(params: SearchParams): RoundFilters {
  const range = first(params.range) as DateRange;
  const page = Number.parseInt(first(params.page), 10);
  const size = Number.parseInt(first(params.size), 10);
  const start = first(params.start);
  const end = first(params.end);
  const sortBy = first(params.sort) as RoundSortField;
  const sortOrder = first(params.order);

  return {
    course: first(params.course),
    range: DATE_RANGE_OPTIONS.some((option) => option.value === range) ? range : "all",
    start: isIsoDate(start) ? start : "",
    end: isIsoDate(end) ? end : "",
    page: Number.isFinite(page) && page > 0 ? page : 1,
    size: PAGE_SIZE_OPTIONS.includes(size) ? size : DEFAULT_PAGE_SIZE,
    sortBy: SORT_FIELDS.includes(sortBy) ? sortBy : DEFAULT_SORT_BY,
    sortOrder: sortOrder === "asc" || sortOrder === "desc" ? sortOrder : DEFAULT_SORT_ORDER,
  };
}

/** Query string for the /rounds page URL; omits defaults to keep URLs short. */
export function roundFiltersToQuery(filters: RoundFilters): string {
  const params = new URLSearchParams();
  if (filters.course) params.set("course", filters.course);
  if (filters.range !== "all") params.set("range", filters.range);
  if (filters.range === "custom") {
    if (filters.start) params.set("start", filters.start);
    if (filters.end) params.set("end", filters.end);
  }
  if (filters.page > 1) params.set("page", String(filters.page));
  if (filters.size !== DEFAULT_PAGE_SIZE) params.set("size", String(filters.size));
  if (filters.sortBy !== DEFAULT_SORT_BY || filters.sortOrder !== DEFAULT_SORT_ORDER) {
    params.set("sort", filters.sortBy);
    params.set("order", filters.sortOrder);
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Inclusive start/end dates (yyyy-MM-dd) for the API, based on the selected range. */
export function resolveDateRange(
  filters: RoundFilters,
  today: Date = new Date(),
): { startDate?: string; endDate?: string } {
  switch (filters.range) {
    case "last30": {
      const start = new Date(today);
      start.setDate(start.getDate() - 30);
      return { startDate: toIsoDate(start), endDate: toIsoDate(today) };
    }
    case "year":
      return {
        startDate: `${today.getFullYear()}-01-01`,
        endDate: `${today.getFullYear()}-12-31`,
      };
    case "custom":
      return {
        startDate: filters.start || undefined,
        endDate: filters.end || undefined,
      };
    default:
      return {};
  }
}
