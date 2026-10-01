import Link from "next/link";
import SortHeader, { ariaSort } from "@/components/SortHeader";
import { eagleResultLabel, type EagleHole } from "@/lib/hallOfFame";
import type { SortOrder } from "@/lib/roundSummary";

export default function EaglesTable({
  holes,
  sortOrder,
  toggleSortHref,
  returnTo,
}: {
  holes: EagleHole[];
  /** Current round-date sort direction. */
  sortOrder: SortOrder;
  /** URL that reverses the date sort. */
  toggleSortHref: string;
  /** Path the Round Details page links back to. */
  returnTo: string;
}) {
  const detailsQuery = `?back=${encodeURIComponent(returnTo)}`;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-emerald-900/15 text-left text-xs uppercase tracking-wide text-[#5b6a5c]">
            <th aria-sort={ariaSort(true, sortOrder)} className="px-2 py-2 font-medium">
              <SortHeader label="Date" href={toggleSortHref} active order={sortOrder} />
            </th>
            <th className="px-2 py-2 font-medium">Course</th>
            <th className="px-2 py-2 text-right font-medium">Hole</th>
            <th className="px-2 py-2 font-medium">Result</th>
            <th className="px-2 py-2 text-right font-medium">Putts</th>
            <th className="px-2 py-2">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {holes.map((hole) => (
            <tr
              key={hole.holeId}
              className="border-b border-emerald-900/10 last:border-0 hover:bg-emerald-50/60"
            >
              <td className="whitespace-nowrap px-2 py-2">{hole.roundDate}</td>
              <td className="whitespace-nowrap px-2 py-2">{hole.course}</td>
              <td className="px-2 py-2 text-right font-semibold tabular-nums">{hole.holeNumber}</td>
              <td className="whitespace-nowrap px-2 py-2">
                <span className="font-medium text-emerald-800">
                  {eagleResultLabel(hole.par, hole.score)}
                </span>
                <span className="ml-2 text-xs text-[#5b6a5c]">
                  {hole.score} on a par {hole.par}
                </span>
              </td>
              <td className="px-2 py-2 text-right tabular-nums">{hole.putts}</td>
              <td className="whitespace-nowrap px-2 py-1.5 text-right">
                <Link
                  href={`/rounds/${hole.roundId}${detailsQuery}`}
                  className="inline-flex items-center rounded-md border border-emerald-800/30 px-2.5 py-1 text-xs font-medium text-emerald-900 hover:bg-emerald-50"
                >
                  Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
