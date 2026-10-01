"use client";

import { useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import {
  DATE_RANGE_OPTIONS,
  PAGE_SIZE_OPTIONS,
  roundFiltersToQuery,
  type DateRange,
  type RoundFilters,
} from "@/lib/roundFilters";

const SELECT_CLASS =
  "rounded-md border border-emerald-900/20 bg-white px-3 py-1.5 text-sm text-[#1a2e1c]";

export default function RoundsFilters({
  filters: currentFilters,
  courses,
}: {
  filters: RoundFilters;
  courses: string[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [filters, setOptimisticFilters] = useOptimistic(currentFilters);

  const invalidRange =
    filters.range === "custom" &&
    filters.start !== "" &&
    filters.end !== "" &&
    filters.start > filters.end;

  function apply(changes: Partial<RoundFilters>) {
    const next = { ...filters, page: 1, ...changes };
    startTransition(() => {
      setOptimisticFilters(next);
      router.push(`/rounds${roundFiltersToQuery(next)}`);
    });
  }

  return (
    <div className="flex flex-wrap items-end gap-4 rounded-xl border border-emerald-900/10 bg-white p-4 shadow-sm">
      <label className="flex flex-col gap-1 text-xs font-medium uppercase tracking-wide text-[#5b6a5c]">
        Course
        <select
          value={filters.course}
          onChange={(event) => apply({ course: event.target.value })}
          className={`${SELECT_CLASS} w-72 normal-case tracking-normal`}
        >
          <option value="">All courses</option>
          {courses.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-xs font-medium uppercase tracking-wide text-[#5b6a5c]">
        Dates
        <select
          value={filters.range}
          onChange={(event) => apply({ range: event.target.value as DateRange })}
          className={`${SELECT_CLASS} normal-case tracking-normal`}
        >
          {DATE_RANGE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      {filters.range === "custom" && (
        <>
          <label className="flex flex-col gap-1 text-xs font-medium uppercase tracking-wide text-[#5b6a5c]">
            From
            <input
              type="date"
              value={filters.start}
              max={filters.end || undefined}
              onChange={(event) => apply({ start: event.target.value })}
              className={SELECT_CLASS}
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium uppercase tracking-wide text-[#5b6a5c]">
            To
            <input
              type="date"
              value={filters.end}
              min={filters.start || undefined}
              onChange={(event) => apply({ end: event.target.value })}
              className={SELECT_CLASS}
            />
          </label>
        </>
      )}

      <label className="ml-auto flex flex-col gap-1 text-xs font-medium uppercase tracking-wide text-[#5b6a5c]">
        Per page
        <select
          value={filters.size}
          onChange={(event) => apply({ size: Number(event.target.value) })}
          className={`${SELECT_CLASS} normal-case tracking-normal`}
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </label>

      {(pending || invalidRange) && (
        <p
          className={`basis-full text-sm ${invalidRange ? "text-red-800" : "text-[#5b6a5c]"}`}
        >
          {invalidRange ? "The start date must be on or before the end date." : "Updating…"}
        </p>
      )}
    </div>
  );
}
