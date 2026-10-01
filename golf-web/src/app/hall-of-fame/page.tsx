import EaglesTable from "@/components/EaglesTable";
import Pagination from "@/components/Pagination";
import TopRoundsTable from "@/components/TopRoundsTable";
import {
  fetchEagles,
  fetchTopRounds,
  type EagleHole,
  type TopRound,
} from "@/lib/hallOfFame";
import type { PagedResponse, SortOrder } from "@/lib/roundSummary";

const TOP_ROUNDS = 10;
const DEFAULT_EAGLE_PAGE_SIZE = 10;
const MAX_EAGLE_PAGE_SIZE = 100;

type EagleParams = { page: number; order: SortOrder; size: number };

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

function parseEagleParams(params: Record<string, string | string[] | undefined>): EagleParams {
  const page = Number.parseInt(first(params.page), 10);
  const size = Number.parseInt(first(params.size), 10);
  return {
    page: Number.isFinite(page) && page > 0 ? page : 1,
    order: first(params.order) === "asc" ? "asc" : "desc",
    size:
      Number.isFinite(size) && size > 0 && size <= MAX_EAGLE_PAGE_SIZE
        ? size
        : DEFAULT_EAGLE_PAGE_SIZE,
  };
}

/** Query string for the /hall-of-fame URL; omits defaults to keep URLs short. */
function eagleQuery({ page, order, size }: EagleParams): string {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (order !== "desc") params.set("order", order);
  if (size !== DEFAULT_EAGLE_PAGE_SIZE) params.set("size", String(size));
  const query = params.toString();
  return query ? `?${query}` : "";
}

function errorMessage(reason: unknown, fallback: string): string {
  return reason instanceof Error ? reason.message : fallback;
}

export default async function HallOfFamePage({ searchParams }: PageProps<"/hall-of-fame">) {
  const eagleParams = parseEagleParams(await searchParams);
  const returnTo = `/hall-of-fame${eagleQuery(eagleParams)}`;

  const [topResult, eaglesResult] = await Promise.allSettled([
    fetchTopRounds(TOP_ROUNDS),
    fetchEagles({
      sortOrder: eagleParams.order,
      page: eagleParams.page - 1,
      size: eagleParams.size,
    }),
  ]);

  const topRounds: TopRound[] | null = topResult.status === "fulfilled" ? topResult.value : null;
  const eagles: PagedResponse<EagleHole> | null =
    eaglesResult.status === "fulfilled" ? eaglesResult.value : null;

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold text-[#14532d]">Hall of Fame</h1>
        <p className="mt-1 text-sm text-[#5b6a5c]">
          Best rounds and biggest holes, all time.
        </p>
      </div>

      <section className="space-y-4 rounded-xl border border-emerald-900/10 bg-white p-5 shadow-sm">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-800">
            Top {TOP_ROUNDS} Rounds
          </h2>
          <p className="mt-1 text-xs text-[#5b6a5c]">
            Full 18-hole rounds ranked by score relative to course par.
          </p>
        </div>
        {topResult.status === "rejected" ? (
          <p className="text-sm text-red-800">
            Could not load top rounds ({errorMessage(topResult.reason, "unknown error")}).
          </p>
        ) : !topRounds || topRounds.length === 0 ? (
          <p className="text-sm text-[#5b6a5c]">No full 18-hole rounds recorded yet.</p>
        ) : (
          <TopRoundsTable rounds={topRounds} returnTo={returnTo} />
        )}
      </section>

      <section
        id="eagles"
        className="scroll-mt-20 space-y-4 rounded-xl border border-emerald-900/10 bg-white p-5 shadow-sm"
      >
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-800">
            Eagles &amp; Better
          </h2>
          <p className="mt-1 text-xs text-[#5b6a5c]">
            Every hole scored two or more under par.
          </p>
        </div>
        {eaglesResult.status === "rejected" ? (
          <p className="text-sm text-red-800">
            Could not load eagles ({errorMessage(eaglesResult.reason, "unknown error")}).
          </p>
        ) : !eagles || eagles.content.length === 0 ? (
          <p className="text-sm text-[#5b6a5c]">
            {eagles && eagles.totalElements > 0
              ? "No eagles on this page."
              : "No eagles yet. Keep swinging!"}
          </p>
        ) : (
          <>
            <EaglesTable
              holes={eagles.content}
              sortOrder={eagleParams.order}
              toggleSortHref={`/hall-of-fame${eagleQuery({
                ...eagleParams,
                order: eagleParams.order === "asc" ? "desc" : "asc",
                page: 1,
              })}`}
              returnTo={`${returnTo}#eagles`}
            />
            <Pagination
              page={eagleParams.page}
              totalPages={eagles.totalPages}
              totalElements={eagles.totalElements}
              size={eagleParams.size}
              itemLabel={eagles.totalElements === 1 ? "eagle" : "eagles"}
              hrefForPage={(page) => `/hall-of-fame${eagleQuery({ ...eagleParams, page })}#eagles`}
            />
          </>
        )}
      </section>
    </main>
  );
}
