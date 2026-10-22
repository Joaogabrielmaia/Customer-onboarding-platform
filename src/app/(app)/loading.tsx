export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="animate-pulse space-y-4">
      <span className="sr-only">Carregando...</span>
      <div className="h-8 w-1/3 rounded bg-slate-300" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-24 rounded-lg bg-slate-200" />)}
      </div>
      <div className="h-32 rounded-lg bg-slate-200" />
    </div>
  );
}
