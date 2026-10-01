import Link from "next/link";
import DeleteRoundButton from "@/components/DeleteRoundButton";
import SortHeader, { ariaSort } from "@/components/SortHeader";
import type { RoundSortField, RoundSummary, SortOrder } from "@/lib/roundSummary";

type Column = {
  key: keyof RoundSummary;
  label: string;
  numeric?: boolean;
  detailOnly?: boolean;
  emphasize?: boolean;
  sortField?: RoundSortField;
};

const COLUMNS: Column[] = [
  { key: "roundDate", label: "Date", sortField: "date" },
  { key: "course", label: "Course" },
  { key: "teeType", label: "Tees", detailOnly: true },
  { key: "score", label: "Score", numeric: true, emphasize: true, sortField: "score" },
  { key: "frontNine", label: "Front", numeric: true, detailOnly: true, sortField: "frontNine" },
  { key: "backNine", label: "Back", numeric: true, detailOnly: true, sortField: "backNine" },
  { key: "putts", label: "Putts", numeric: true, sortField: "putts" },
  { key: "eagles", label: "Eagles", numeric: true },
  { key: "birdies", label: "Birdies", numeric: true },
  { key: "pars", label: "Pars", numeric: true },
  { key: "bogeys", label: "Bogeys", numeric: true },
  { key: "doubleBogeys", label: "Doubles", numeric: true },
  { key: "tripleOrMore", label: "Triple+", numeric: true },
];

function formatCell(round: RoundSummary, key: keyof RoundSummary): string {
  const value = round[key];
  if (value == null || value === "") {
    return "–";
  }
  if (key === "teeType" && typeof value === "string") {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  return String(value);
}

export type RoundsTableSort = {
  by: RoundSortField;
  order: SortOrder;
  /** URL that shows the table sorted by the given column. */
  hrefFor: (field: RoundSortField) => string;
};

export default function RoundsTable({
  rounds,
  detailed = false,
  returnTo,
  sort,
}: {
  rounds: RoundSummary[];
  /** Adds tees and front/back nine columns. */
  detailed?: boolean;
  /** Path the Round Details page links back to. */
  returnTo?: string;
  /** Makes the Date, Score, Front, Back and Putts headers clickable. */
  sort?: RoundsTableSort;
}) {
  const columns = COLUMNS.filter((column) => detailed || !column.detailOnly);
  const detailsQuery = returnTo ? `?back=${encodeURIComponent(returnTo)}` : "";

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-emerald-900/15 text-left text-xs uppercase tracking-wide text-[#5b6a5c]">
            {columns.map((column) => {
              const sortField = sort ? column.sortField : undefined;
              const active = !!sort && sort.by === sortField;
              return (
                <th
                  key={column.key}
                  aria-sort={sort ? ariaSort(active, sort.order) : undefined}
                  className={`whitespace-nowrap px-2 py-2 font-medium ${
                    column.numeric ? "text-right" : ""
                  }`}
                >
                  {sort && sortField ? (
                    <SortHeader
                      label={column.label}
                      href={sort.hrefFor(sortField)}
                      active={active}
                      order={sort.order}
                      alignRight={column.numeric}
                    />
                  ) : (
                    column.label
                  )}
                </th>
              );
            })}
            <th className="px-2 py-2">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rounds.map((round) => (
            <tr
              key={round.roundId}
              className="border-b border-emerald-900/10 last:border-0 hover:bg-emerald-50/60"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`whitespace-nowrap px-2 py-2 ${
                    column.numeric ? "text-right tabular-nums" : ""
                  } ${column.emphasize ? "font-semibold" : ""}`}
                >
                  {formatCell(round, column.key)}
                </td>
              ))}
              <td className="whitespace-nowrap px-2 py-1.5 text-right">
                <div className="inline-flex items-center gap-1.5">
                  <Link
                    href={`/rounds/${round.roundId}${detailsQuery}`}
                    className="inline-flex items-center rounded-md border border-emerald-800/30 px-2.5 py-1 text-xs font-medium text-emerald-900 hover:bg-emerald-50"
                  >
                    Details
                  </Link>
                  <DeleteRoundButton
                    roundId={round.roundId}
                    course={round.course}
                    roundDate={round.roundDate}
                    score={round.score}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
