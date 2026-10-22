import path from "node:path";
import { expect, test, type Page } from "@playwright/test";
import { DEMO_PORTAL_TOKEN } from "../../src/server/seed-data";
import { ADMIN, DIEGO, login, openDeployment } from "../e2e/helpers";

// Gera os prints de docs/screenshots/ com o app real e os dados de demonstração (fictícios).
const OUT = path.resolve(process.cwd(), "docs/screenshots");
const shot = (page: Page, name: string, fullPage = true) => page.screenshot({ path: path.join(OUT, name), fullPage });

test.use({ viewport: { width: 1280, height: 800 } });

test("telas de desktop", async ({ page }) => {
  await page.goto("/login");
  await shot(page, "01-login.png", false);

  await login(page, ADMIN);
  await expect(page.getByRole("region", { name: "Atenção primeiro" })).toBeVisible();
  await shot(page, "02-painel.png");

  await page.goto("/pendencias");
  await shot(page, "03-minhas-pendencias.png");

  await page.goto("/implantacoes/nova");
  await page.getByLabel("Modelo de implantação").selectOption({ label: "Implantação Padrão — Plano Profissional" });
  await shot(page, "04-nova-implantacao.png");

  await openDeployment(page, "Distribuidora Santa Rita Alimentos");
  const fiscal = page.getByRole("listitem").filter({ hasText: "Parametrização fiscal" }).first();
  await fiscal.getByText(/Detalhes e comentários/).click();
  await expect(fiscal).toContainText("módulo de entregas");
  await shot(page, "05-detalhe-implantacao.png");

  await page.getByRole("link", { name: "Histórico" }).click();
  await expect(page.getByRole("list", { name: "Histórico de alterações" })).toBeVisible();
  await shot(page, "06-historico.png");

  await page.goto("/modelos");
  await page.getByRole("link", { name: "Implantação Padrão — Plano Profissional" }).first().click();
  await expect(page.getByLabel("Nome do modelo")).toHaveValue("Implantação Padrão — Plano Profissional");
  await shot(page, "07-modelo.png");

  await page.goto("/clientes");
  await shot(page, "08-clientes.png");
});

test("portal do cliente, no desktop e no celular", async ({ page, browser }) => {
  await page.goto(`/p/${DEMO_PORTAL_TOKEN}`);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Santa Rita");
  await shot(page, "09-portal-cliente.png");

  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, locale: "pt-BR" });
  const m = await mobile.newPage();
  await m.goto(`/p/${DEMO_PORTAL_TOKEN}`);
  await expect(m.getByRole("heading", { level: 1 })).toContainText("Santa Rita");
  await shot(m, "10-portal-cliente-mobile.png");

  await login(m, DIEGO);
  await expect(m.getByRole("region", { name: "Atenção primeiro" })).toBeVisible();
  await shot(m, "11-painel-mobile.png");
  await mobile.close();
});
