import Link from "next/link";
import type { ReactNode } from "react";

const tones = {
  neutral: "bg-slate-100 text-slate-800 border-slate-300",
  danger: "bg-red-50 text-red-900 border-red-300",
  warning: "bg-amber-50 text-amber-900 border-amber-300",
  success: "bg-emerald-50 text-emerald-900 border-emerald-300",
  info: "bg-indigo-50 text-indigo-900 border-indigo-300",
} as const;

export type Tone = keyof typeof tones;

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function PageHeader({ title, description, actions }: { title: string; description?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-slate-700">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-lg border border-slate-300 bg-white p-4 shadow-sm ${className}`}>{children}</section>;
}

export function LinkButton({ href, children, variant = "primary" }: { href: string; children: ReactNode; variant?: "primary" | "secondary" }) {
  const styles =
    variant === "primary"
      ? "bg-indigo-700 text-white hover:bg-indigo-800"
      : "border border-slate-400 bg-white text-slate-900 hover:bg-slate-100";
  return (
    <Link href={href} className={`inline-block rounded-md px-4 py-2 text-center font-medium ${styles}`}>
      {children}
    </Link>
  );
}

export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-400 bg-white p-8 text-center">
      <p className="text-lg font-semibold text-slate-900">{title}</p>
      {children && <p className="mx-auto mt-1 max-w-md text-slate-700">{children}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        className="h-2.5 w-full min-w-24 overflow-hidden rounded-full bg-slate-200"
      >
        <div className="h-full rounded-full bg-indigo-700" style={{ width: `${value}%` }} />
      </div>
      <span className="w-10 shrink-0 text-right text-sm font-semibold text-slate-900">{value}%</span>
    </div>
  );
}

export function StatCard({ label, value, tone = "neutral", note }: { label: string; value: ReactNode; tone?: Tone; note?: string }) {
  return (
    <div className={`rounded-lg border p-4 ${tones[tone]}`}>
      <p className="text-sm font-medium">{label}</p>
      <p className="mt-1 text-3xl font-bold">{value}</p>
      {note && <p className="mt-1 text-xs">{note}</p>}
    </div>
  );
}

export function Notice({ tone = "info", children }: { tone?: Tone; children: ReactNode }) {
  return <p className={`rounded-md border px-3 py-2 text-sm ${tones[tone]}`}>{children}</p>;
}
