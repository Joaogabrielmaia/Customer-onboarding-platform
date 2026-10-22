import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { ADMIN, DIEGO, login, openDeployment } from "./helpers";

// RNF-07: verificação AUTOMÁTICA com axe-core (regras WCAG 2.x A/AA). Ela não substitui
// o teste manual com teclado e leitor de tela; só pega o que uma máquina consegue pegar.
async function expectNoSeriousViolations(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
  const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  expect(
    serious.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(" | ")}`),
  ).toEqual([]);
}

test.describe("acessibilidade (axe)", () => {
  test("login", async ({ page }) => {
    await page.goto("/login");
    await expectNoSeriousViolations(page);
  });

  test("painel", async ({ page }) => {
    await login(page, ADMIN);
    await expectNoSeriousViolations(page);
  });

  test("detalhe da implantação, com os detalhes de uma tarefa abertos", async ({ page }) => {
    await login(page, DIEGO);
    await openDeployment(page, "Distribuidora Santa Rita Alimentos");
    await page.getByText(/Detalhes e comentários/).first().click();
    await expectNoSeriousViolations(page);
  });

  test("lista de clientes e formulário", async ({ page }) => {
    await login(page, DIEGO);
    await page.goto("/clientes");
    await expectNoSeriousViolations(page);
    await page.goto("/clientes/novo");
    await expectNoSeriousViolations(page);
  });

  test("editor de modelo", async ({ page }) => {
    await login(page, ADMIN);
    await page.goto("/modelos/novo");
    await expectNoSeriousViolations(page);
  });

  test("portal do cliente", async ({ page }) => {
    await login(page, ADMIN);
    await openDeployment(page, "Bebidas Vale Verde");
    await page.getByRole("button", { name: /Gerar/ }).click();
    const url = await page.getByRole("textbox", { name: "Link do cliente" }).inputValue();
    await page.goto(url);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Bebidas Vale Verde");
    await expectNoSeriousViolations(page);
  });
});
