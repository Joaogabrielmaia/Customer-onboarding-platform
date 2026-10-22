import { addDays } from "./dates";

export function computeDueDate(kickoff: Date, offsetDays: number): Date {
  if (!Number.isInteger(offsetDays) || offsetDays < 0) {
    throw new Error("O prazo relativo deve ser um número inteiro de dias, maior ou igual a zero.");
  }
  // dias corridos; se cair no fim de semana, vai pra segunda
  const due = addDays(kickoff, offsetDays);
  const weekday = due.getUTCDay();
  if (weekday === 6) return addDays(due, 2);
  if (weekday === 0) return addDays(due, 1);
  return due;
}
