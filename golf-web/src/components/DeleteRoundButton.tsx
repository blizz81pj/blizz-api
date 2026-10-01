"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { deleteRound } from "@/lib/roundDetail";

export default function DeleteRoundButton({
  roundId,
  course,
  roundDate,
  score,
}: {
  roundId: number;
  course: string;
  roundDate: string;
  score: number;
}) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [deleting, setDeleting] = useState(false);
  const [refreshing, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const busy = deleting || refreshing;

  function open() {
    setError(null);
    dialogRef.current?.showModal();
  }

  function close() {
    if (!busy) dialogRef.current?.close();
  }

  async function confirmDelete() {
    setDeleting(true);
    setError(null);
    try {
      await deleteRound(roundId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete the round.");
      setDeleting(false);
      return;
    }
    setDeleting(false);
    startTransition(() => {
      dialogRef.current?.close();
      router.refresh();
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-label="Delete round"
        title="Delete round"
        className="inline-flex h-[26px] w-[26px] items-center justify-center rounded-md border border-red-800/30 text-red-800 hover:bg-red-50"
      >
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2.5 4h11M6.5 4V2.5h3V4M4 4l.7 9.5h6.6L12 4M6.75 6.5v4.5M9.25 6.5v4.5" />
        </svg>
      </button>

      <dialog
        ref={dialogRef}
        onCancel={(event) => {
          if (busy) event.preventDefault();
        }}
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
        }}
        aria-labelledby={`delete-round-${roundId}-title`}
        className="m-auto w-[min(28rem,calc(100vw-2rem))] whitespace-normal rounded-xl border border-emerald-900/10 bg-white p-0 text-left text-[#1a2e1c] shadow-xl backdrop:bg-black/40"
      >
        <div className="space-y-4 p-6">
          <h2 id={`delete-round-${roundId}-title`} className="text-lg font-semibold">
            Delete this round?
          </h2>
          <p className="text-sm text-[#3d4f3e]">
            Are you sure you want to delete this round? It and all of its hole scores will be
            permanently removed. This can&apos;t be undone.
          </p>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 rounded-lg bg-[#f4f1e8] px-4 py-3 text-sm">
            <dt className="text-[#5b6a5c]">Course</dt>
            <dd className="font-medium">{course}</dd>
            <dt className="text-[#5b6a5c]">Date</dt>
            <dd className="font-medium">{roundDate}</dd>
            <dt className="text-[#5b6a5c]">Score</dt>
            <dd className="font-medium">{score}</dd>
          </dl>
          {error && (
            <p role="alert" className="text-sm text-red-800">
              Could not delete the round ({error}).
            </p>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={close}
              disabled={busy}
              autoFocus
              className="rounded-md border border-emerald-900/20 px-4 py-2 text-sm font-medium hover:bg-emerald-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              disabled={busy}
              className="rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-60"
            >
              {busy ? "Deleting…" : "Delete round"}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
