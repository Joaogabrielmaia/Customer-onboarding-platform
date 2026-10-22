import { describe, expect, it } from "vitest";
import { csvCell, toCsv } from "@/domain/csv";

// TC-36 (v1.1, RF-20)
describe("csvCell", () => {
  it("escreve texto simples, números e vazios", () => {
    expect(csvCell("Parametrização fiscal")).toBe("Parametrização fiscal");
    expect(csvCell(42)).toBe("42");
    expect(csvCell(0)).toBe("0");
    expect(csvCell(null)).toBe("");
    expect(csvCell(undefined)).toBe("");
  });

  it("coloca entre aspas o que tem ponto e vírgula, aspas ou quebra de linha", () => {
    expect(csvCell("a;b")).toBe('"a;b"');
    expect(csvCell('disse "oi"')).toBe('"disse ""oi"""');
    expect(csvCell("linha 1\nlinha 2")).toBe('"linha 1\nlinha 2"');
  });

  it("neutraliza injeção de fórmula em texto que começa com = + - @ ou tab", () => {
    expect(csvCell("=1+1")).toBe("'=1+1");
    expect(csvCell("+55 31 90000-0000")).toBe("'+55 31 90000-0000");
    expect(csvCell("-2 dias")).toBe("'-2 dias");
    expect(csvCell("@SOMA(A1)")).toBe("'@SOMA(A1)");
    expect(csvCell("\t=cmd")).toBe("'\t=cmd");
    expect(csvCell('=HYPERLINK("http://exemplo.invalid";"clique")')).toBe(`"'=HYPERLINK(""http://exemplo.invalid"";""clique"")"`);
  });

  it("não altera números negativos (são números, não texto)", () => {
    expect(csvCell(-3)).toBe("-3");
  });

  it("só protege o início do texto, não o meio", () => {
    expect(csvCell("D+3 após o kickoff")).toBe("D+3 após o kickoff");
    expect(csvCell("a=b")).toBe("a=b");
  });
});

describe("toCsv", () => {
  it("junta com ponto e vírgula e termina cada linha com CRLF", () => {
    expect(toCsv([["Empresa", "Dias"], ["Santa Rita", 6]])).toBe("Empresa;Dias\r\nSanta Rita;6\r\n");
  });
});
