
// data civil = dia sem hora, guardado como Date em 00:00 UTC (o que o Prisma devolve em coluna @db.Date)

const DAY_MS = 24 * 60 * 60 * 1000;

export function civilDate(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day));
}

export function parseCivil(iso: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) throw new Error(`Data inválida: ${iso}`);
  const date = civilDate(Number(match[1]), Number(match[2]), Number(match[3]));
  if (formatCivil(date) !== iso) throw new Error(`Data inválida: ${iso}`);
  return date;
}

export function formatCivil(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function formatBR(date: Date): string {
  const [y, m, d] = formatCivil(date).split("-");
  return `${d}/${m}/${y}`;
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS);
}

export function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / DAY_MS);
}

export function todayCivil(now: Date = new Date(), timeZone = "America/Sao_Paulo"): Date {
  const iso = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  return parseCivil(iso);
}
