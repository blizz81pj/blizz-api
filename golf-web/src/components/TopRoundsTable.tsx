import Link from "next/link";
import { formatRoundToPar, rankByToPar, type TopRound } from "@/lib/hallOfFame";

const RANK_BADGE: Record<number, string> = {
  1: "bg-amber-300 text-amber-950",
  2: "bg-slate-300 text-slate-900",
  3: "bg-orange-300 text-orange-950",
};

function capitalize(value: string | null): string {
  if (!value) return "–";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function TopRoundsTable({
  rounds,
  returnTo,
}: {
  rounds: TopRound[];
  /** Path the Round Details page links back to. */
  returnTo: string;
}) {
  const ranks = rankByToPar(rounds);
  const detailsQuery = `?back=${encodeURIComponent(returnTo)}`;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-emerald-900/15 text-left text-xs uppercase tracking-wide text-[#5b6a5c]">
            <th className="px-2 py-2 font-medium">#</th>
            <th className="px-2 py-2 font-medium">Course</th>
            <th className="px-2 py-2 font-medium">Date</th>
            <th className="px-2 py-2 font-medium">Tees</th>
            <th className="px-2 py-2 text-right font-medium">Par</th>
            <th className="px-2 py-2 text-right font-medium">Score</th>
            <th className="px-2 py-2 text-right font-medium">To Par</th>
            <th className="px-2 py-2">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rounds.map((round, index) => {
            const rank = ranks[index];
            return (
              <tr
                key={round.roundId}
                className="border-b border-emerald-900/10 last:border-0 hover:bg-emerald-50/60"
              >
                <td className="px-2 py-2">
                  <span
                    className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-semibold tabular-nums ${
                      RANK_BADGE[rank] ?? "bg-emerald-50 text-emerald-900"
                    }`}
                  >
                    {rank}
                  </span>
                </td>
                <td className="whitespace-nowrap px-2 py-2">{round.course}</td>
                <td className="whitespace-nowrap px-2 py-2">{round.roundDate}</td>
                <td className="whitespace-nowrap px-2 py-2">{capitalize(round.teeType)}</td>
                <td className="px-2 py-2 text-right tabular-nums">{round.par}</td>
                <td className="px-2 py-2 text-right font-semibold tabular-nums">{round.score}</td>
                <td
                  className={`px-2 py-2 text-right font-semibold tabular-nums ${
                    round.toPar < 0 ? "text-emerald-700" : ""
                  }`}
                >
                  {formatRoundToPar(round.toPar)}
                </td>
                <td className="whitespace-nowrap px-2 py-1.5 text-right">
                  <Link
                    href={`/rounds/${round.roundId}${detailsQuery}`}
                    className="inline-flex items-center rounded-md border border-emerald-800/30 px-2.5 py-1 text-xs font-medium text-emerald-900 hover:bg-emerald-50"
                  >
                    Details
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
