"use client";

import { useRef, useState } from "react";
import {
  fetchCourseHoleSummary,
  formatToPar,
  HOLE_SORT_OPTIONS,
  toParColors,
  type HoleScoringSummary,
  type HoleSortOption,
} from "@/lib/courseSummary";

const COUNT_COLUMNS: Array<{ key: keyof HoleScoringSummary; label: string }> = [
  { key: "eagles", label: "Eagles" },
  { key: "birdies", label: "Birdies" },
  { key: "pars", label: "Pars" },
  { key: "bogeys", label: "Bogeys" },
  { key: "doubleBogeys", label: "Doubles" },
  { key: "tripleOrMore", label: "Triple+" },
];

const SELECT_CLASS =
  "rounded-md border border-emerald-900/20 bg-white px-3 py-1.5 text-sm text-[#1a2e1c] disabled:opacity-60";

export default function CourseScoringSummary({
  courses,
  loadError,
}: {
  courses: string[];
  loadError?: string;
}) {
  const [course, setCourse] = useState("");
  const [sort, setSort] = useState<HoleSortOption>("holeNumber");
  const [holes, setHoles] = useState<HoleScoringSummary[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const latestRequest = useRef(0);

  async function load(nextCourse: string, nextSort: HoleSortOption) {
    const requestId = ++latestRequest.current;
    if (!nextCourse) {
      setHoles(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await fetchCourseHoleSummary(nextCourse, nextSort);
      if (requestId === latestRequest.current) {
        setHoles(data);
      }
    } catch (err) {
      if (requestId === latestRequest.current) {
        setHoles(null);
        setError(err instanceof Error ? err.message : "Could not load holes.");
      }
    } finally {
      if (requestId === latestRequest.current) {
        setLoading(false);
      }
    }
  }

  return (
    <section className="rounded-xl border border-emerald-900/10 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-800">
          Course Scoring Summary
        </h2>
        <label className="flex items-center gap-2 text-sm text-[#5b6a5c]">
          Sort by
          <select
            value={sort}
            disabled={!course}
            onChange={(event) => {
              const nextSort = event.target.value as HoleSortOption;
              setSort(nextSort);
              load(course, nextSort);
            }}
            className={SELECT_CLASS}
          >
            {HOLE_SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loadError ? (
        <p className="text-sm text-red-800">Could not load courses ({loadError}).</p>
      ) : (
        <label className="flex flex-col gap-1 text-sm text-[#5b6a5c] sm:flex-row sm:items-center sm:gap-2">
          Course
          <select
            value={course}
            onChange={(event) => {
              const nextCourse = event.target.value;
              setCourse(nextCourse);
              load(nextCourse, sort);
            }}
            className={`${SELECT_CLASS} w-full sm:w-96`}
          >
            <option value="">Select a course…</option>
            {courses.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
      )}

      {error && <p className="mt-4 text-sm text-red-800">Could not load holes ({error}).</p>}

      {holes && holes.length === 0 && !loading && (
        <p className="mt-4 text-sm text-[#5b6a5c]">No holes recorded for this course.</p>
      )}

      {holes && holes.length > 0 && (
        <div className={`mt-5 transition-opacity ${loading ? "opacity-50" : ""}`}>
          <CourseOverview holes={holes} />
          <HoleTable holes={holes} />
          <ColorLegend />
        </div>
      )}

      {loading && !holes && <p className="mt-4 text-sm text-[#5b6a5c]">Loading holes…</p>}
    </section>
  );
}

function CourseOverview({ holes }: { holes: HoleScoringSummary[] }) {
  const byHoleNumber = [...holes].sort(
    (a, b) => a.holeNumber - b.holeNumber || a.par - b.par,
  );
  const rounds = Math.max(...holes.map((hole) => hole.timesPlayed));
  const expectedToPar = holes.reduce((sum, hole) => sum + hole.averageToPar, 0);
  const expectedPutts = holes.reduce((sum, hole) => sum + hole.averagePutts, 0);

  return (
    <div className="mb-5 space-y-3">
      <dl className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
        <Stat label="Rounds played" value={String(rounds)} />
        <Stat label="Avg round vs par" value={formatToPar(expectedToPar)} />
        <Stat label="Avg putts per round" value={expectedPutts.toFixed(1)} />
      </dl>
      <div className="flex flex-wrap gap-1">
        {byHoleNumber.map((hole) => (
          <div
            key={`${hole.holeNumber}-${hole.par}`}
            title={`Hole ${hole.holeNumber} (par ${hole.par}): ${formatToPar(hole.averageToPar)}`}
            style={toParColors(hole.averageToPar)}
            className="flex h-12 w-12 flex-col items-center justify-center rounded-md text-xs"
          >
            <span className="font-semibold">{hole.holeNumber}</span>
            <span className="tabular-nums">{formatToPar(hole.averageToPar)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HoleTable({ holes }: { holes: HoleScoringSummary[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-emerald-900/15 text-right text-xs uppercase tracking-wide text-[#5b6a5c]">
            <th className="px-3 py-2 text-left font-medium">Hole</th>
            <th className="px-3 py-2 font-medium">Par</th>
            <th className="px-3 py-2 font-medium">Played</th>
            <th className="px-3 py-2 font-medium">Avg</th>
            <th className="px-3 py-2 font-medium">vs Par</th>
            <th className="px-3 py-2 font-medium">Avg putts</th>
            {COUNT_COLUMNS.map((column) => (
              <th key={column.key} className="px-3 py-2 font-medium">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {holes.map((hole) => (
            <tr
              key={`${hole.holeNumber}-${hole.par}`}
              className="border-b border-emerald-900/10 text-right tabular-nums last:border-0"
            >
              <td className="px-3 py-2 text-left font-semibold">{hole.holeNumber}</td>
              <td className="px-3 py-2">{hole.par}</td>
              <td className="px-3 py-2">{hole.timesPlayed}</td>
              <td className="px-3 py-2">{hole.averageScore.toFixed(2)}</td>
              <td className="px-3 py-1.5">
                <span
                  style={toParColors(hole.averageToPar)}
                  className="inline-block min-w-16 rounded-md px-2 py-0.5 text-center font-semibold"
                >
                  {formatToPar(hole.averageToPar)}
                </span>
              </td>
              <td className="px-3 py-2">{hole.averagePutts.toFixed(2)}</td>
              {COUNT_COLUMNS.map((column) => (
                <td key={column.key} className="px-3 py-2">
                  {hole[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ColorLegend() {
  return (
    <div className="mt-4 flex items-center gap-3 text-xs text-[#5b6a5c]">
      <span>Avg vs par</span>
      <div className="w-48">
        <div
          className="h-2 rounded-full"
          style={{
            background: `linear-gradient(to right, ${toParColors(0).background}, ${
              toParColors(1).background
            }, ${toParColors(2).background})`,
          }}
        />
        <div className="mt-1 flex justify-between">
          <span>E or better</span>
          <span>+1</span>
          <span>+2 or worse</span>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-[#5b6a5c]">{label}</dt>
      <dd className="text-lg font-semibold tabular-nums text-[#14532d]">{value}</dd>
    </div>
  );
}
