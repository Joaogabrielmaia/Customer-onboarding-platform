import { addDays } from "./dates";

/**
 * RN-01: prazo = kickoff + n dias corridos. Se cair em sábado ou domingo,
 * vai para a segunda-feira seguinte. Feriados não são considerados no MVP.
 */
export function computeDueDate(kickoff: Date, offsetDays: number): Date {
  if (!Number.isInteger(offsetDays) || offsetDays < 0) {
    throw new Error("O prazo relativo deve ser um número inteiro de dias, maior ou igual a zero.");
  }
  const due = addDays(kickoff, offsetDays);
  const weekday = due.getUTCDay(); // 0 = domingo, 6 = sábado
  if (weekday === 6) return addDays(due, 2);
  if (weekday === 0) return addDays(due, 1);
  return due;
}
