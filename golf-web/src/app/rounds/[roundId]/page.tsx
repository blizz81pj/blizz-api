import Link from "next/link";
import { notFound } from "next/navigation";
import RoundDetailView from "@/components/RoundDetailView";
import { fetchRoundDetail } from "@/lib/roundDetail";

function safeBackHref(value: string | string[] | undefined): string {
  const href = Array.isArray(value) ? value[0] : value;
  return href && href.startsWith("/") && !href.startsWith("//") ? href : "/rounds";
}

export default async function RoundDetailsPage({
  params,
  searchParams,
}: PageProps<"/rounds/[roundId]">) {
  const { roundId } = await params;
  if (!/^\d+$/.test(roundId)) {
    notFound();
  }

  const backHref = safeBackHref((await searchParams).back);
  const backLabel =
    backHref === "/"
      ? "Back to Golf Stats"
      : backHref.startsWith("/hall-of-fame")
        ? "Back to Hall of Fame"
        : "Back to rounds";

  let round;
  let error: string | null = null;
  try {
    round = await fetchRoundDetail(roundId);
  } catch (err) {
    error = err instanceof Error ? err.message : "Could not load round.";
  }
  if (round === null) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
      <Link href={backHref} className="text-sm font-medium text-emerald-800 hover:underline">
        ← {backLabel}
      </Link>
      {error || !round ? (
        <p className="rounded-xl border border-red-700/30 bg-red-50 p-5 text-sm text-red-900">
          Could not load round ({error}).
        </p>
      ) : (
        <RoundDetailView initialRound={round} />
      )}
    </main>
  );
}
