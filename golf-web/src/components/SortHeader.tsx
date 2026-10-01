import Link from "next/link";
import type { SortOrder } from "@/lib/roundSummary";

/** Clickable column heading with a ▲/▼ indicator; unsorted columns show a faint ↕. */
export default function SortHeader({
  label,
  href,
  active,
  order,
  alignRight,
}: {
  label: string;
  href: string;
  active: boolean;
  order: SortOrder;
  alignRight?: boolean;
}) {
  const indicator = active ? (order === "asc" ? "▲" : "▼") : "↕";

  return (
    <Link
      href={href}
      scroll={false}
      className={`group relative inline-block rounded hover:text-emerald-900 ${
        active ? "text-emerald-900" : ""
      }`}
    >
      {label}
      {/* Sits in the cell padding so the arrows don't widen the table. */}
      <span
        aria-hidden
        className={`absolute top-1/2 -translate-y-1/2 text-[0.6rem] leading-none ${
          alignRight ? "right-full mr-0.5" : "left-full ml-0.5"
        } ${active ? "" : "opacity-30 group-hover:opacity-70"}`}
      >
        {indicator}
      </span>
    </Link>
  );
}

export function ariaSort(active: boolean, order: SortOrder): "ascending" | "descending" | undefined {
  if (!active) return undefined;
  return order === "asc" ? "ascending" : "descending";
}
