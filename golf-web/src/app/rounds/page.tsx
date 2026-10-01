import { redirect } from "next/navigation";
import Pagination from "@/components/Pagination";
import RoundsFilters from "@/components/RoundsFilters";
import RoundsTable from "@/components/RoundsTable";
import { fetchCourses } from "@/lib/courses";
import {
  initialSortOrder,
  parseRoundFilters,
  resolveDateRange,
  roundFiltersToQuery,
} from "@/lib/roundFilters";
import {
  fetchRoundsSummary,
  type PagedResponse,
  type RoundSortField,
  type RoundSummary,
} from "@/lib/roundSummary";

const SORT_DESCRIPTIONS: Record<RoundSortField, [asc: string, desc: string]> = {
  date: ["oldest first", "newest first"],
  score: ["lowest score first", "highest score first"],
  frontNine: ["lowest front nine first", "highest front nine first"],
  backNine: ["lowest back nine first", "highest back nine first"],
  putts: ["fewest putts first", "most putts first"],
};

export default async function ViewRoundsPage({ searchParams }: PageProps<"/rounds">) {
  const filters = parseRoundFilters(await searchParams);
  const { startDate, endDate } = resolveDateRange(filters);
  const invalidRange = startDate && endDate && startDate > endDate;

  const [coursesResult, roundsResult] = await Promise.allSettled([
    fetchCourses(),
    invalidRange
      ? Promise.resolve(null)
      : fetchRoundsSummary({
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
          page: filters.page - 1,
          size: filters.size,
          course: filters.course || undefined,
          startDate,
          endDate,
        }),
  ]);

  const courses = coursesResult.status === "fulfilled" ? coursesResult.value : [];
  const rounds: PagedResponse<RoundSummary> | null =
    roundsResult.status === "fulfilled" ? roundsResult.value : null;
  const error =
    roundsResult.status === "rejected"
      ? roundsResult.reason instanceof Error
        ? roundsResult.reason.message
        : "Could not load rounds."
      : null;

  if (rounds && rounds.content.length === 0 && filters.page > rounds.totalPages && filters.page > 1) {
    redirect(`/rounds${roundFiltersToQuery({ ...filters, page: Math.max(rounds.totalPages, 1) })}`);
  }

  const sortDescription =
    SORT_DESCRIPTIONS[filters.sortBy][filters.sortOrder === "asc" ? 0 : 1];
  const hrefForSort = (sortBy: RoundSortField) => {
    const sortOrder =
      sortBy === filters.sortBy
        ? filters.sortOrder === "asc"
          ? "desc"
          : "asc"
        : initialSortOrder(sortBy);
    return `/rounds${roundFiltersToQuery({ ...filters, sortBy, sortOrder, page: 1 })}`;
  };

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold text-[#14532d]">View Rounds</h1>
        <p className="mt-1 text-sm text-[#5b6a5c]">
          Every recorded round, {sortDescription}. Filter by course or date range, or click
          a column heading to sort.
        </p>
      </div>

      <RoundsFilters filters={filters} courses={courses} />

      <section className="space-y-4 rounded-xl border border-emerald-900/10 bg-white p-5 shadow-sm">
        {error ? (
          <p className="text-sm text-red-800">Could not load rounds ({error}).</p>
        ) : !rounds ? (
          <p className="text-sm text-[#5b6a5c]">Choose a valid date range to see rounds.</p>
        ) : rounds.content.length === 0 ? (
          <p className="text-sm text-[#5b6a5c]">No rounds match these filters.</p>
        ) : (
          <>
            <RoundsTable
              rounds={rounds.content}
              detailed
              returnTo={`/rounds${roundFiltersToQuery(filters)}`}
              sort={{ by: filters.sortBy, order: filters.sortOrder, hrefFor: hrefForSort }}
            />
            <Pagination
              page={filters.page}
              totalPages={rounds.totalPages}
              totalElements={rounds.totalElements}
              size={filters.size}
              hrefForPage={(page) => `/rounds${roundFiltersToQuery({ ...filters, page })}`}
            />
          </>
        )}
      </section>
    </main>
  );
}
