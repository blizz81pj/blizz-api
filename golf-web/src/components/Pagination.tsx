import Link from "next/link";

const WINDOW = 2;

function pageNumbers(current: number, total: number): Array<number | "gap"> {
  const pages = new Set<number>([1, total]);
  for (let page = current - WINDOW; page <= current + WINDOW; page += 1) {
    if (page >= 1 && page <= total) {
      pages.add(page);
    }
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const result: Array<number | "gap"> = [];
  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) {
      result.push("gap");
    }
    result.push(page);
  });
  return result;
}

const LINK_CLASS =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm";

export default function Pagination({
  page,
  totalPages,
  totalElements,
  size,
  hrefForPage,
  itemLabel = "rounds",
}: {
  /** 1-based */
  page: number;
  totalPages: number;
  totalElements: number;
  size: number;
  hrefForPage: (page: number) => string;
  /** Plural noun for the summary line, e.g. "Showing 1–20 of 45 rounds". */
  itemLabel?: string;
}) {
  const firstShown = totalElements === 0 ? 0 : (page - 1) * size + 1;
  const lastShown = Math.min(page * size, totalElements);

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-between gap-3 text-sm text-[#5b6a5c]"
    >
      <p>
        {firstShown > lastShown
          ? `${totalElements} ${itemLabel}`
          : `Showing ${firstShown}–${lastShown} of ${totalElements} ${itemLabel}`}
      </p>

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center gap-1">
          <PageLink href={hrefForPage(page - 1)} disabled={page <= 1}>
            ← Prev
          </PageLink>
          {pageNumbers(page, totalPages).map((item, index) =>
            item === "gap" ? (
              <span key={`gap-${index}`} className="px-1">
                …
              </span>
            ) : (
              <PageLink key={item} href={hrefForPage(item)} current={item === page}>
                {item}
              </PageLink>
            ),
          )}
          <PageLink href={hrefForPage(page + 1)} disabled={page >= totalPages}>
            Next →
          </PageLink>
        </div>
      )}
    </nav>
  );
}

function PageLink({
  href,
  disabled,
  current,
  children,
}: {
  href: string;
  disabled?: boolean;
  current?: boolean;
  children: React.ReactNode;
}) {
  if (disabled) {
    return (
      <span className={`${LINK_CLASS} border-emerald-900/10 text-[#9aa79b]`}>{children}</span>
    );
  }
  if (current) {
    return (
      <span
        aria-current="page"
        className={`${LINK_CLASS} border-[#14532d] bg-[#14532d] font-semibold text-white`}
      >
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className={`${LINK_CLASS} border-emerald-900/20 bg-white text-[#1a2e1c] hover:bg-emerald-50`}
    >
      {children}
    </Link>
  );
}
