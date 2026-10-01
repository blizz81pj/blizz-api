"use client";

import { useRef, useState } from "react";
import {
  emptyHole,
  emptyRoundForm,
  eventsToRoundForm,
  roundFormToEvents,
  type HoleFormRow,
  type RoundFormState,
} from "@/lib/golfScore";
import { parseSwingUCsv, type ParsedSwingURound } from "@/lib/parseSwingUCsv";

type SubmitStatus = {
  kind: "success" | "error";
  message: string;
} | null;

const HOLE_FIELDS: Array<{ key: keyof HoleFormRow; label: string }> = [
  { key: "holeNumber", label: "Hole" },
  { key: "par", label: "Par" },
  { key: "strokeIndex", label: "SI" },
  { key: "score", label: "Score" },
  { key: "putts", label: "Putts" },
  { key: "driveResult", label: "Drive" },
  { key: "penaltyStrokes", label: "Penalty" },
  { key: "bunkerHit", label: "Bunker" },
  { key: "netScore", label: "Net" },
  { key: "strokesTaken", label: "Strokes taken" },
];

export default function EnterRoundForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<RoundFormState>(() => emptyRoundForm());
  const [csvRounds, setCsvRounds] = useState<ParsedSwingURound[]>([]);
  const [selectedRoundId, setSelectedRoundId] = useState("");
  const [csvNote, setCsvNote] = useState("");
  const [status, setStatus] = useState<SubmitStatus>(null);
  const [submitting, setSubmitting] = useState(false);

  function updateRoundField(field: keyof Omit<RoundFormState, "holes">, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateHole(index: number, field: keyof HoleFormRow, value: string) {
    setForm((current) => ({
      ...current,
      holes: current.holes.map((hole, holeIndex) =>
        holeIndex === index ? { ...hole, [field]: value } : hole,
      ),
    }));
  }

  function loadRound(round: ParsedSwingURound) {
    setForm(eventsToRoundForm(round.events));
    setSelectedRoundId(round.roundId);
  }

  async function onCsvSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const rounds = parseSwingUCsv(text);
      if (rounds.length === 0) {
        setCsvRounds([]);
        setCsvNote("No score rows were found in that CSV.");
        return;
      }

      setCsvRounds(rounds);
      loadRound(rounds[0]);
      setCsvNote(
        rounds.length === 1
          ? `Loaded 1 round (${rounds[0].events.length} holes) from ${file.name}.`
          : `Loaded ${rounds.length} rounds from ${file.name}. Choose a round to fill the form.`,
      );
      setStatus(null);
    } catch (error) {
      setCsvNote(
        error instanceof Error ? error.message : "Could not read that CSV file.",
      );
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const payload = roundFormToEvents(form);
      const response = await fetch("/api/golf-scores/insert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const message = (await response.text()) || response.statusText;

      setStatus({
        kind: response.ok ? "success" : "error",
        message: `${response.status} ${response.statusText}: ${message}`,
      });
    } catch (error) {
      setStatus({
        kind: "error",
        message:
          error instanceof Error
            ? error.message
            : "Request failed before a response was received.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-[#14532d]">Enter a Round</h1>
          <p className="mt-1 text-sm text-[#5b6a5c]">
            Fill the fields below or load a SwingU CSV, then submit to the insert
            endpoint.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={onCsvSelected}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-md bg-[#14532d] px-4 py-2 text-sm font-medium text-white hover:bg-[#166534]"
          >
            + Add a SwingU Score
          </button>
        </div>
      </div>

      {csvNote && (
        <div className="mb-4 rounded-md border border-emerald-800/20 bg-white px-4 py-3 text-sm">
          <p>{csvNote}</p>
          {csvRounds.length > 1 && (
            <label className="mt-3 flex flex-col gap-1 text-sm">
              Round to load
              <select
                value={selectedRoundId}
                onChange={(event) => {
                  const round = csvRounds.find(
                    (item) => item.roundId === event.target.value,
                  );
                  if (round) {
                    loadRound(round);
                  }
                }}
                className="max-w-xl rounded-md border border-emerald-900/20 bg-white px-3 py-2"
              >
                {csvRounds.map((round) => (
                  <option key={round.roundId} value={round.roundId}>
                    {round.dateInserted || "no date"} — {round.course} (
                    {round.events.length} holes, round {round.roundId})
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-8">
        <section className="rounded-xl border border-emerald-900/10 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-emerald-800">
            Round
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field
              label="Course"
              value={form.course}
              onChange={(value) => updateRoundField("course", value)}
            />
            <Field
              label="Scorecard ID"
              value={form.scorecardId}
              onChange={(value) => updateRoundField("scorecardId", value)}
            />
            <Field
              label="Tee type"
              value={form.teeType}
              onChange={(value) => updateRoundField("teeType", value)}
            />
            <Field
              label="Scorecard type"
              value={form.scorecardType}
              onChange={(value) => updateRoundField("scorecardType", value)}
            />
            <Field
              label="Handicap type"
              value={form.handicapType}
              onChange={(value) => updateRoundField("handicapType", value)}
            />
            <Field
              label="Handicap"
              value={form.handicap}
              onChange={(value) => updateRoundField("handicap", value)}
            />
            <Field
              label="Date inserted"
              value={form.dateInserted}
              onChange={(value) => updateRoundField("dateInserted", value)}
            />
          </div>
        </section>

        <section className="rounded-xl border border-emerald-900/10 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-800">
              Holes
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    holes: [...current.holes, emptyHole(current.holes.length + 1)],
                  }))
                }
                className="rounded-md border border-emerald-800/30 px-3 py-1.5 text-sm hover:bg-emerald-50"
              >
                Add hole
              </button>
              <button
                type="button"
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    holes: current.holes.slice(0, -1),
                  }))
                }
                className="rounded-md border border-emerald-800/30 px-3 py-1.5 text-sm hover:bg-emerald-50"
              >
                Remove last hole
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-emerald-900/15 text-left">
                  {HOLE_FIELDS.map((field) => (
                    <th key={field.key} className="px-2 py-2 font-medium">
                      {field.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {form.holes.map((hole, index) => (
                  <tr key={index} className="border-b border-emerald-900/10">
                    {HOLE_FIELDS.map((field) => (
                      <td key={field.key} className="px-1 py-1">
                        <input
                          value={hole[field.key]}
                          onChange={(event) =>
                            updateHole(index, field.key, event.target.value)
                          }
                          className="w-20 rounded border border-emerald-900/15 px-2 py-1 lg:w-24"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {status && (
          <p
            role="status"
            className={`rounded-md px-4 py-3 text-sm ${
              status.kind === "success"
                ? "border border-emerald-700/30 bg-emerald-50 text-emerald-900"
                : "border border-red-700/30 bg-red-50 text-red-900"
            }`}
          >
            {status.message}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-[#14532d] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#166534] disabled:opacity-60"
        >
          {submitting ? "Submitting…" : "Enter Round"}
        </button>
      </form>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-md border border-emerald-900/20 px-3 py-2"
      />
    </label>
  );
}
