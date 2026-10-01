import Link from "next/link";
import RoundsTable from "@/components/RoundsTable";
import { fetchRoundsSummary, type RoundSummary } from "@/lib/roundSummary";

export default async function LastRoundsWidget({ count = 5 }: { count?: number }) {
  let rounds: RoundSummary[] = [];
  let error: string | null = null;

  try {
    const result = await fetchRoundsSummary({ sortOrder: "desc", size: count });
    rounds = result.content;
  } catch (err) {
    error = err instanceof Error ? err.message : "Could not load rounds.";
  }

  return (
    <WidgetShell title={`Last ${count} Rounds`}>
      {error ? (
        <p className="text-sm text-red-800">Could not load rounds ({error}).</p>
      ) : rounds.length === 0 ? (
        <p className="text-sm text-[#5b6a5c]">No rounds recorded yet.</p>
      ) : (
        <RoundsTable rounds={rounds} returnTo="/" />
      )}
    </WidgetShell>
  );
}

export function LastRoundsWidgetSkeleton({ count = 5 }: { count?: number }) {
  return (
    <WidgetShell title={`Last ${count} Rounds`}>
      <p className="text-sm text-[#5b6a5c]">Loading rounds…</p>
    </WidgetShell>
  );
}

function WidgetShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-emerald-900/10 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-800">
          {title}
        </h2>
        <Link href="/rounds" className="text-sm font-medium text-emerald-800 hover:underline">
          View all rounds →
        </Link>
      </div>
      {children}
    </section>
  );
}
