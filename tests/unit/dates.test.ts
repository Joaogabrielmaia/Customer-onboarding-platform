import { describe, expect, it } from "vitest";
import { addDays, daysBetween, formatBR, formatCivil, parseCivil, todayCivil } from "@/domain/dates";

describe("datas civis", () => {
  it("faz ida e volta entre texto e Date", () => {
    expect(formatCivil(parseCivil("2026-03-05"))).toBe("2026-03-05");
    expect(formatBR(parseCivil("2026-03-05"))).toBe("05/03/2026");
  });

  it("rejeita datas inexistentes e formatos errados", () => {
    expect(() => parseCivil("2026-02-31")).toThrow();
    expect(() => parseCivil("05/03/2026")).toThrow();
    expect(() => parseCivil("")).toThrow();
  });

  it("calcula diferença em dias", () => {
    expect(daysBetween(parseCivil("2026-03-01"), parseCivil("2026-03-04"))).toBe(3);
    expect(daysBetween(parseCivil("2026-03-04"), parseCivil("2026-03-01"))).toBe(-3);
    expect(formatCivil(addDays(parseCivil("2026-02-27"), 2))).toBe("2026-03-01");
  });

  it("usa o dia de São Paulo, não o de UTC, em todayCivil", () => {
    expect(formatCivil(todayCivil(new Date("2026-03-05T02:00:00Z")))).toBe("2026-03-04");
    expect(formatCivil(todayCivil(new Date("2026-03-05T12:00:00Z")))).toBe("2026-03-05");
  });
});
