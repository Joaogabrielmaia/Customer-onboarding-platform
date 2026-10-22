// Geração de CSV para abrir no Excel em português: separador ponto e vírgula e quebra de linha CRLF.

export const CSV_SEPARATOR = ";";

export type CsvValue = string | number | null | undefined;

/**
 * Protege contra injeção de fórmula: uma célula de texto que começa com = + - @ (ou tab/CR)
 * é interpretada como fórmula pelo Excel e pelo Calc. Prefixo com apóstrofo para virar texto.
 * Números não passam por aqui: são escritos como estão.
 */
function neutralizeFormula(text: string): string {
  return /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
}

/** Uma célula: texto protegido contra fórmula e escapado (aspas dobradas, entre aspas se preciso). */
export function csvCell(value: CsvValue): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "number") return String(value);
  const text = neutralizeFormula(value);
  return /[;"\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function toCsv(rows: CsvValue[][]): string {
  return rows.map((row) => row.map(csvCell).join(CSV_SEPARATOR)).join("\r\n") + "\r\n";
}
