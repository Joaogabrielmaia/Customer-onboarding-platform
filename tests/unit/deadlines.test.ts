import { describe, expect, it } from "vitest";
import { formatCivil, parseCivil } from "@/domain/dates";
import { computeDueDate } from "@/domain/deadlines";

const due = (kickoff: string, offset: number) => formatCivil(computeDueDate(parseCivil(kickoff), offset));

describe("computeDueDate (RN-01)", () => {
  it("soma dias corridos quando o resultado cai em dia útil", () => {
    // segunda 2026-03-02 + 3 = quinta 2026-03-05 (US-05 CA1)
    expect(due("2026-03-02", 3)).toBe("2026-03-05");
  });

  it("D+0 é o próprio dia do kickoff", () => {
    expect(due("2026-03-02", 0)).toBe("2026-03-02");
  });

  it("desloca domingo para a segunda seguinte (US-05 CA2)", () => {
    // quinta 2026-03-05 + 3 = domingo 2026-03-08 -> segunda 2026-03-09
    expect(due("2026-03-05", 3)).toBe("2026-03-09");
  });

  it("desloca sábado para a segunda seguinte", () => {
    // quinta 2026-03-05 + 2 = sábado 2026-03-07 -> segunda 2026-03-09
    expect(due("2026-03-05", 2)).toBe("2026-03-09");
  });

  it("atravessa virada de mês e de ano", () => {
    // quarta 2026-12-30 + 5 = segunda 2027-01-04
    expect(due("2026-12-30", 5)).toBe("2027-01-04");
  });

  it("trata ano bissexto", () => {
    // sexta 2028-02-25 + 4 = terça 2028-02-29
    expect(due("2028-02-25", 4)).toBe("2028-02-29");
  });

  it("rejeita prazo negativo ou não inteiro", () => {
    expect(() => computeDueDate(parseCivil("2026-03-02"), -1)).toThrow();
    expect(() => computeDueDate(parseCivil("2026-03-02"), 1.5)).toThrow();
  });
});
