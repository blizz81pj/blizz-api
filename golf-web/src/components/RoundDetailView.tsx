"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  formatRoundDateTime,
  formatScoreToPar,
  saveRound,
  SCORE_MARK_LEGEND,
  scoreMarkClass,
  type RoundDetail,
  type RoundUpdateRequest,
} from "@/lib/roundDetail";

type HoleField = "par" | "strokeIndex" | "score" | "putts" | "netScore" | "strokesTaken";

type HoleDraft = { holeId: number; holeNumber: number } & Record<HoleField, string>;

type RoundDraft = {
  course: string;
  teeType: string;
  handicap: string;
  dateInserted: string;
  holes: HoleDraft[];
};

const SCORECARD_ROWS: Array<{ field: HoleField; label: string; total: boolean }> = [
  { field: "par", label: "Par", total: true },
  { field: "strokeIndex", label: "SI", total: false },
  { field: "score", label: "Score", total: true },
  { field: "putts", label: "Putts", total: true },
  { field: "netScore", label: "Net", total: true },
  { field: "strokesTaken", label: "Strokes", total: true },
];

type Status = { kind: "success" | "error"; message: string } | null;

function toDraft(round: RoundDetail): RoundDraft {
  return {
    course: round.course,
    teeType: round.teeType,
    handicap: String(round.handicap),
    dateInserted: round.dateInserted,
    holes: round.holes.map((hole) => ({
      holeId: hole.holeId,
      holeNumber: hole.holeNumber,
      par: String(hole.par),
      strokeIndex: String(hole.strokeIndex),
      score: String(hole.score),
      putts: String(hole.putts),
      netScore: String(hole.netScore),
      strokesTaken: String(hole.strokesTaken),
    })),
  };
}

function toNumber(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === "") return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

function toRequest(draft: RoundDraft): RoundUpdateRequest {
  return {
    course: draft.course.trim(),
    teeType: draft.teeType.trim(),
    handicap: toNumber(draft.handicap) as number,
    dateInserted: draft.dateInserted,
    holes: draft.holes.map((hole) => ({
      holeId: hole.holeId,
      holeNumber: hole.holeNumber,
      par: toNumber(hole.par),
      strokeIndex: toNumber(hole.strokeIndex),
      score: toNumber(hole.score),
      putts: toNumber(hole.putts),
      netScore: toNumber(hole.netScore),
      strokesTaken: toNumber(hole.strokesTaken),
    })),
  };
}

function sum(holes: HoleDraft[], field: HoleField): number {
  return holes.reduce((total, hole) => total + (toNumber(hole[field]) ?? 0), 0);
}

export default function RoundDetailView({ initialRound }: { initialRound: RoundDetail }) {
  const router = useRouter();
  const [round, setRound] = useState(initialRound);
  const [draft, setDraft] = useState<RoundDraft>(() => toDraft(initialRound));
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const holes = draft.holes;
  const frontNine = holes.filter((hole) => hole.holeNumber <= 9);
  const backNine = holes.filter((hole) => hole.holeNumber > 9);
  const totalScore = sum(holes, "score");
  const totalPar = sum(holes, "par");

  function startEditing() {
    setDraft(toDraft(round));
    setStatus(null);
    setEditing(true);
  }

  function cancelEditing() {
    setDraft(toDraft(round));
    setEditing(false);
  }

  function updateHole(holeId: number, field: HoleField, value: string) {
    setDraft((current) => ({
      ...current,
      holes: current.holes.map((hole) =>
        hole.holeId === holeId ? { ...hole, [field]: value } : hole,
      ),
    }));
  }

  async function save() {
    setSaving(true);
    setStatus(null);
    try {
      const updated = await saveRound(round.roundId, toRequest(draft));
      setRound(updated);
      setDraft(toDraft(updated));
      setEditing(false);
      setStatus({ kind: "success", message: "Changes saved." });
      router.refresh();
    } catch (err) {
      setStatus({
        kind: "error",
        message: err instanceof Error ? err.message : "Could not save changes.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-emerald-900/10 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
              Round Details
            </p>
            {editing ? (
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <TextField
                  label="Course"
                  value={draft.course}
                  onChange={(course) => setDraft((d) => ({ ...d, course }))}
                  className="lg:col-span-2"
                />
                <TextField
                  label="Tees"
                  value={draft.teeType}
                  onChange={(teeType) => setDraft((d) => ({ ...d, teeType }))}
                />
                <TextField
                  label="Handicap"
                  value={draft.handicap}
                  inputMode="numeric"
                  onChange={(handicap) => setDraft((d) => ({ ...d, handicap }))}
                />
                <TextField
                  label="Date & time"
                  type="datetime-local"
                  step={1}
                  value={draft.dateInserted}
                  onChange={(dateInserted) => setDraft((d) => ({ ...d, dateInserted }))}
                  className="sm:col-span-2"
                />
              </div>
            ) : (
              <>
                <h1 className="mt-1 text-2xl font-semibold text-[#14532d]">{round.course}</h1>
                <p className="mt-1 text-sm text-[#5b6a5c]">
                  {formatRoundDateTime(round.dateInserted)}
                  {" · "}
                  <span className="capitalize">{round.teeType}</span> tees
                  {" · "}Handicap {round.handicap}
                </p>
              </>
            )}
          </div>

          <div className="flex gap-2">
            {editing ? (
              <>
                <button
                  type="button"
                  onClick={cancelEditing}
                  disabled={saving}
                  className="rounded-md border border-emerald-800/30 px-4 py-2 text-sm font-medium hover:bg-emerald-50 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={save}
                  disabled={saving}
                  className="rounded-md bg-[#14532d] px-4 py-2 text-sm font-semibold text-white hover:bg-[#166534] disabled:opacity-60"
                >
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={startEditing}
                className="rounded-md bg-[#14532d] px-4 py-2 text-sm font-semibold text-white hover:bg-[#166534]"
              >
                Edit Round
              </button>
            )}
          </div>
        </div>

        {status && (
          <p
            role="status"
            className={`mt-4 rounded-md px-4 py-3 text-sm ${
              status.kind === "success"
                ? "border border-emerald-700/30 bg-emerald-50 text-emerald-900"
                : "border border-red-700/30 bg-red-50 text-red-900"
            }`}
          >
            {status.message}
          </p>
        )}

        <dl className="mt-5 grid grid-cols-3 gap-4 sm:grid-cols-6">
          <Stat label="Score" value={String(totalScore)} emphasize />
          <Stat label="vs Par" value={formatScoreToPar(totalScore - totalPar)} />
          <Stat label="Front" value={frontNine.length ? String(sum(frontNine, "score")) : "–"} />
          <Stat label="Back" value={backNine.length ? String(sum(backNine, "score")) : "–"} />
          <Stat label="Putts" value={String(sum(holes, "putts"))} />
          <Stat label="Net" value={String(sum(holes, "netScore"))} />
        </dl>
      </section>

      <section className="space-y-4 rounded-xl border border-emerald-900/10 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-800">
          Scorecard
        </h2>
        {holes.length === 0 ? (
          <p className="text-sm text-[#5b6a5c]">No holes recorded for this round.</p>
        ) : (
          <>
            {frontNine.length > 0 && (
              <Scorecard
                holes={frontNine}
                summaryLabel="Out"
                totalHoles={backNine.length === 0 ? holes : undefined}
                editing={editing}
                onChange={updateHole}
              />
            )}
            {backNine.length > 0 && (
              <Scorecard
                holes={backNine}
                summaryLabel="In"
                totalHoles={holes}
                editing={editing}
                onChange={updateHole}
              />
            )}
            <ScoreLegend />
          </>
        )}
      </section>
    </div>
  );
}

function Scorecard({
  holes,
  summaryLabel,
  totalHoles,
  editing,
  onChange,
}: {
  holes: HoleDraft[];
  summaryLabel: string;
  /** When set, adds a Total column summed over these holes. */
  totalHoles?: HoleDraft[];
  editing: boolean;
  onChange: (holeId: number, field: HoleField, value: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-center text-sm tabular-nums">
        <thead>
          <tr className="bg-[#14532d] text-white">
            <th className="w-20 px-2 py-2 text-left text-xs font-semibold uppercase tracking-wide">
              Hole
            </th>
            {holes.map((hole) => (
              <th key={hole.holeId} className="px-1 py-2 font-semibold">
                {hole.holeNumber}
              </th>
            ))}
            <th className="bg-[#0f3d22] px-2 py-2 text-xs font-semibold uppercase">
              {summaryLabel}
            </th>
            {totalHoles && (
              <th className="bg-[#0b2e1a] px-2 py-2 text-xs font-semibold uppercase">Total</th>
            )}
          </tr>
        </thead>
        <tbody>
          {SCORECARD_ROWS.map((row) => (
            <tr key={row.field} className="border-b border-emerald-900/10">
              <th className="px-2 py-1.5 text-left text-xs font-medium uppercase tracking-wide text-[#5b6a5c]">
                {row.label}
              </th>
              {holes.map((hole) => (
                <td key={hole.holeId} className="px-1 py-1">
                  {editing ? (
                    <input
                      value={hole[row.field]}
                      inputMode="numeric"
                      aria-label={`Hole ${hole.holeNumber} ${row.label}`}
                      onChange={(event) => onChange(hole.holeId, row.field, event.target.value)}
                      className="w-11 rounded border border-emerald-900/20 px-1 py-1 text-center"
                    />
                  ) : row.field === "score" ? (
                    <span
                      className={`inline-flex h-7 min-w-7 items-center justify-center rounded-full px-1 font-semibold ${scoreMarkClass(
                        toNumber(hole.score),
                        toNumber(hole.par),
                      )}`}
                    >
                      {hole.score}
                    </span>
                  ) : (
                    hole[row.field]
                  )}
                </td>
              ))}
              <td className="bg-emerald-50 px-2 py-1 font-semibold">
                {row.total ? sum(holes, row.field) : ""}
              </td>
              {totalHoles && (
                <td className="bg-emerald-100/70 px-2 py-1 font-semibold">
                  {row.total ? sum(totalHoles, row.field) : ""}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ScoreLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#5b6a5c]">
      {SCORE_MARK_LEGEND.map((item) => (
        <span key={item.label} className="flex items-center gap-1.5">
          <span
            className={`inline-block h-4 w-4 rounded-full border border-emerald-900/15 ${scoreMarkClass(
              item.score,
              item.par,
            )}`}
          />
          {item.label}
        </span>
      ))}
    </div>
  );
}

function Stat({ label, value, emphasize }: { label: string; value: string; emphasize?: boolean }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-[#5b6a5c]">{label}</dt>
      <dd
        className={`font-semibold tabular-nums text-[#14532d] ${emphasize ? "text-3xl" : "text-xl"}`}
      >
        {value}
      </dd>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  className = "",
  ...inputProps
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return (
    <label className={`flex flex-col gap-1 text-xs font-medium uppercase tracking-wide text-[#5b6a5c] ${className}`}>
      {label}
      <input
        {...inputProps}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-md border border-emerald-900/20 px-3 py-2 text-sm normal-case tracking-normal text-[#1a2e1c]"
      />
    </label>
  );
}
