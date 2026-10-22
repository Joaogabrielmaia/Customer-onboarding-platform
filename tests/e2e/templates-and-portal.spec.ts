import { expect, test } from "@playwright/test";
import { ADMIN, DIEGO, login, openDeployment } from "./helpers";

test.describe("modelos", () => {
  test("o administrador cria um modelo com etapa e tarefa", async ({ page }) => {
    await login(page, ADMIN);
    await page.goto("/modelos/novo");
    await page.getByLabel("Nome do modelo").fill("Modelo de teste E2E");
    await page.getByLabel("Nome da etapa").fill("Dados do cliente");
    await page.getByLabel("Tarefa *").fill("Receber planilha de produtos");
    await page.getByLabel(/Prazo \(D\+n\)/).fill("7");
    await page.getByRole("button", { name: "Salvar modelo" }).click();
    await expect(page).toHaveURL(/\/modelos$/);
    await expect(page.getByRole("link", { name: "Modelo de teste E2E" })).toBeVisible();
  });

  test("recusa prazo negativo com a mensagem no campo", async ({ page }) => {
    await login(page, ADMIN);
    await page.goto("/modelos/novo");
    await page.getByLabel("Nome do modelo").fill("Modelo inválido");
    await page.getByLabel("Nome da etapa").fill("Etapa");
    await page.getByLabel("Tarefa *").fill("Tarefa");
    await page.getByLabel(/Prazo \(D\+n\)/).fill("-1");
    await page.getByRole("button", { name: "Salvar modelo" }).click();
    await expect(page.getByText("O prazo não pode ser negativo.")).toBeVisible();
    await expect(page).toHaveURL(/\/modelos\/novo$/);
  });

  test("o implantador vê os modelos, mas não os edita", async ({ page }) => {
    await login(page, DIEGO);
    await page.goto("/modelos");
    await expect(page.getByRole("link", { name: "Implantação Padrão — Plano Profissional" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Novo modelo" })).toHaveCount(0);
    await page.goto("/modelos/novo");
    await expect(page).toHaveURL(/\/$/);
  });
});

test.describe("portal do cliente", () => {
  test("gera o link, o cliente abre no celular sem login e não vê dados internos; revogar derruba o acesso", async ({ page, browser }) => {
    await login(page, DIEGO);
    await openDeployment(page, "Distribuidora Santa Rita Alimentos");

    await page.getByRole("button", { name: "Gerar novo link (revoga o anterior)" }).click();
    const linkField = page.getByRole("textbox", { name: "Link do cliente" });
    await expect(linkField).toBeVisible();
    const url = await linkField.inputValue();
    expect(url).toMatch(/\/p\/[A-Za-z0-9_-]{43}$/);
    await expect(page.getByText(/Olá! Segue o link para acompanhar a implantação/)).toBeVisible();

    const client = await browser.newContext({ viewport: { width: 360, height: 740 }, locale: "pt-BR" });
    const portal = await client.newPage();
    const response = await portal.goto(url);
    expect(response?.headers()["referrer-policy"]).toBe("no-referrer");
    expect(response?.headers()["x-robots-tag"]).toContain("noindex");

    await expect(portal.getByRole("heading", { name: "Implantação de Distribuidora Santa Rita Alimentos", level: 1 })).toBeVisible();
    await expect(portal.getByRole("progressbar", { name: "Progresso da implantação" })).toBeVisible();
    await expect(portal.getByRole("heading", { name: "Próximas etapas" })).toBeVisible();
    const body = await portal.locator("body").innerText();
    expect(body).not.toContain("módulo de entregas");
    expect(body).not.toContain("Revisão interna");
    expect(body).not.toContain("Configurar contas a receber");
    expect(body).not.toContain("Histórico");
    const overflow = await portal.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);

    await page.getByRole("button", { name: "Revogar link" }).click();
    await expect(page.getByText("Link revogado.")).toBeVisible();
    const after = await portal.goto(url);
    expect(after?.status()).toBe(404);
    await expect(portal.getByRole("heading", { name: "Este link não está mais disponível" })).toBeVisible();
    await client.close();
  });

  test("um link inventado mostra a mesma mensagem amigável", async ({ page }) => {
    const response = await page.goto("/p/token-que-nao-existe");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "Este link não está mais disponível" })).toBeVisible();
  });
});
