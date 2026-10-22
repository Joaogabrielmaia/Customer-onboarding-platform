
export const CSV_SEPARATOR = ";";

export type CsvValue = string | number | null | undefined;

// texto começando com = + - @ vira fórmula no Excel; o apóstrofo força texto

function neutralizeFormula(text: string): string {
  return /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
}

export function csvCell(value: CsvValue): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "number") return String(value);
  const text = neutralizeFormula(value);
  return /[;"\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function toCsv(rows: CsvValue[][]): string {
  return rows.map((row) => row.map(csvCell).join(CSV_SEPARATOR)).join("\r\n") + "\r\n";
}
