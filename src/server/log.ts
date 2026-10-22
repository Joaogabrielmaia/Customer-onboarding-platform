// Logs mínimos em JSON, uma linha por evento (RNF-10).
// Regra: nunca registrar senha, token, e-mail ou outros dados pessoais.
type Level = "info" | "warn" | "error";

export function logEvent(level: Level, event: string, meta: Record<string, string | number | boolean | null> = {}): void {
  const line = JSON.stringify({ time: new Date().toISOString(), level, event, ...meta });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}
