"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Page header ─────────────────────────────────────────── */
export function AdminHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-ink-body">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl2 border border-ink-line bg-surface p-6 shadow-card", className)}>
      {children}
    </div>
  );
}

/* ── Toast ───────────────────────────────────────────────── */
type ToastState = { message: string; type: "success" | "error" } | null;

export function useToast() {
  const [toast, setToast] = useState<ToastState>(null);

  const show = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3800);
    return () => clearTimeout(t);
  }, [toast]);

  const node = toast ? (
    <div
      role="status"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-card-hover"
      style={{ borderColor: toast.type === "success" ? "#4FC3F7" : "#fca5a5" }}
    >
      {toast.type === "success" ? (
        <CheckCircle2 className="h-5 w-5 text-cyan-deep" />
      ) : (
        <AlertCircle className="h-5 w-5 text-red-500" />
      )}
      <span className="text-sm font-medium text-ink">{toast.message}</span>
      <button onClick={() => setToast(null)} aria-label="Dismiss" className="text-ink-muted hover:text-ink">
        <X className="h-4 w-4" />
      </button>
    </div>
  ) : null;

  return { show, toastNode: node };
}

/* ── Delete confirm button ───────────────────────────────── */
export function DeleteButton({
  onConfirm,
  label = "Delete",
  itemName,
}: {
  onConfirm: () => Promise<void> | void;
  label?: string;
  itemName?: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!confirming) return;
    const t = setTimeout(() => setConfirming(false), 4000);
    return () => clearTimeout(t);
  }, [confirming]);

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-2">
        <button
          onClick={async () => {
            setBusy(true);
            await onConfirm();
            setBusy(false);
          }}
          disabled={busy}
          className="inline-flex items-center gap-1 rounded-md bg-red-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-60"
        >
          {busy && <Loader2 className="h-3 w-3 animate-spin" />}
          Confirm
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="rounded-md px-2 py-1.5 text-xs font-medium text-ink-muted hover:text-ink"
        >
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      aria-label={itemName ? `Delete ${itemName}` : label}
      className="rounded-md px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
    >
      {label}
    </button>
  );
}

/* ── Small labelled field ────────────────────────────────── */
export function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="nbn-label">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-ink-muted">{hint}</p>}
      {error && (
        <p className="mt-1 text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
