// "Data civil": um dia do calendário, sem hora. É representada por um Date em
// 00:00 UTC, que é o que o Prisma devolve para colunas @db.Date.
// Assim evito bugs de fuso horário nos prazos (RK-03, ADR-004).

const DAY_MS = 24 * 60 * 60 * 1000;

export function civilDate(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day));
}

/** "2026-03-05" vira um Date em 00:00 UTC. */
export function parseCivil(iso: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) throw new Error(`Data inválida: ${iso}`);
  const date = civilDate(Number(match[1]), Number(match[2]), Number(match[3]));
  // Rejeita datas que o JS "corrige" sozinho, como 2026-02-31.
  if (formatCivil(date) !== iso) throw new Error(`Data inválida: ${iso}`);
  return date;
}

/** Date vira "2026-03-05". */
export function formatCivil(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Date vira "05/03/2026". */
export function formatBR(date: Date): string {
  const [y, m, d] = formatCivil(date).split("-");
  return `${d}/${m}/${y}`;
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS);
}

/** Quantidade de dias de `a` até `b` (positivo se `b` é depois de `a`). */
export function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / DAY_MS);
}

/** O dia civil de hoje no fuso da empresa (por padrão, America/Sao_Paulo). */
export function todayCivil(now: Date = new Date(), timeZone = "America/Sao_Paulo"): Date {
  // O locale en-CA formata como AAAA-MM-DD.
  const iso = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  return parseCivil(iso);
}
