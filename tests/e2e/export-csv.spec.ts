import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";
import { DIEGO, login, openDeployment } from "./helpers";

test.describe("exportação em CSV", () => {
  test("baixa o relatório da implantação", async ({ page }) => {
    await login(page, DIEGO);
    await openDeployment(page, "Distribuidora Santa Rita Alimentos");
    const [download] = await Promise.all([page.waitForEvent("download"), page.getByRole("link", { name: "Exportar CSV" }).click()]);

    expect(download.suggestedFilename()).toMatch(/^implantacao-distribuidora-santa-rita-alimentos-\d{4}-\d{2}-\d{2}\.csv$/);
    const content = await readFile((await download.path())!, "utf8");
    expect(content.charCodeAt(0)).toBe(0xfeff);
    const lines = content.slice(1).split("\r\n").filter(Boolean);
    expect(lines[0]).toContain("Etapa;Tarefa;Responsável;Prazo");
    expect(lines.some((l) => l.includes("Parametrização fiscal") && l.includes("Atrasada (equipe)"))).toBe(true);
  });

  test("baixa a lista com os filtros da tela", async ({ page }) => {
    await login(page, DIEGO);
    await page.goto("/implantacoes?situacao=completed");
    const [download] = await Promise.all([page.waitForEvent("download"), page.getByRole("link", { name: "Exportar CSV" }).click()]);
    const content = await readFile((await download.path())!, "utf8");
    const lines = content.slice(1).split("\r\n").filter(Boolean);
    expect(lines).toHaveLength(1 + 2);
    expect(content).toContain("Central de Frios Boa Mesa");
    expect(content).not.toContain("Atacado Serra Azul");
  });

  test("sem login, a rota de arquivo recusa com 401", async ({ request }) => {
    const response = await request.get("/implantacoes/exportar");
    expect(response.status()).toBe(401);
    const one = await request.get("/implantacoes/qualquer-id/exportar");
    expect(one.status()).toBe(401);
  });
});
