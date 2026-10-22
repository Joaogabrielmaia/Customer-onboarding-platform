import { expect, test } from "@playwright/test";
import { ADMIN, DIEGO, login } from "./helpers";

test.describe("painel", () => {
  test("mostra os indicadores e destaca o atraso primeiro", async ({ page }) => {
    await login(page, ADMIN);
    const indicators = page.getByRole("region", { name: "Indicadores" });
    await expect(indicators).toContainText(/Em andamento\s*5/);
    await expect(indicators).toContainText(/Atrasadas \(equipe\)\s*2/);
    await expect(indicators).toContainText(/Aguardando cliente\s*1/);
    await expect(indicators).toContainText(/Concluídas\s*2/);
    await expect(indicators).toContainText(/\d+ dias/);

    const attention = page.getByRole("region", { name: "Atenção primeiro" });
    const first = attention.getByRole("listitem").first();
    await expect(first).toContainText("Atacado Serra Azul");
    await expect(first).toContainText(/\d+ dias de atraso/);
    await expect(attention).toContainText("Aguardando o cliente");
    await expect(attention).toContainText("Não conta como atraso da equipe");
  });

  test("filtra por implantador", async ({ page }) => {
    await login(page, ADMIN);
    await page.getByLabel("Implantador", { exact: true }).selectOption({ label: "Diego Ferreira" });
    await page.getByRole("button", { name: "Filtrar" }).click();
    await expect(page.getByRole("link", { name: "Distribuidora Santa Rita Alimentos" }).first()).toBeVisible();
    await expect(page.getByText("Atacado Serra Azul")).toHaveCount(0);
  });

  test("lista as pendências do implantador, as atrasadas primeiro", async ({ page }) => {
    await login(page, DIEGO);
    await page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Minhas pendências" }).click();
    await expect(page.getByRole("heading", { name: "Minhas pendências", level: 1 })).toBeVisible();
    await expect(page.getByRole("main").getByRole("listitem").first()).toContainText(/dias? de atraso/);
  });

  test("filtra a lista de implantações por situação", async ({ page }) => {
    await login(page, DIEGO);
    await page.goto("/implantacoes?situacao=completed");
    await expect(page.getByRole("link", { name: "Central de Frios Boa Mesa" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Atacado Serra Azul" })).toHaveCount(0);
  });
});

test.describe("clientes", () => {
  test("cadastra um cliente e ele aparece na lista", async ({ page }) => {
    await login(page, DIEGO);
    await page.goto("/clientes/novo");
    await page.getByLabel("Empresa").fill("Distribuidora Nova Aurora");
    await page.getByLabel("Nome do contato").fill("Helena Marques");
    await page.getByLabel("E-mail do contato").fill("helena@novaaurora.example");
    await page.getByLabel("Plano").selectOption("PROFESSIONAL");
    await page.getByLabel("Data do contrato").fill("2026-10-01");
    await page.getByRole("button", { name: "Cadastrar cliente" }).click();
    await expect(page).toHaveURL(/\/clientes$/);
    await expect(page.getByRole("link", { name: "Distribuidora Nova Aurora" })).toBeVisible();
  });

  test("mostra o erro de cada campo e mantém o que foi digitado", async ({ page }) => {
    await login(page, DIEGO);
    await page.goto("/clientes/novo");
    await page.getByLabel("Nome do contato").fill("Pessoa Sem Empresa");
    await page.getByRole("button", { name: "Cadastrar cliente" }).click();
    await expect(page.getByText("Informe o nome da empresa.")).toBeVisible();
    await expect(page.getByText("Escolha o plano.")).toBeVisible();
    await expect(page.getByLabel("Nome do contato")).toHaveValue("Pessoa Sem Empresa");
  });

  test("não arquiva cliente com implantação em andamento", async ({ page }) => {
    await login(page, DIEGO);
    await page.goto("/clientes");
    await page.getByRole("link", { name: "Distribuidora Santa Rita Alimentos" }).click();
    await page.getByRole("button", { name: "Arquivar cliente" }).click();
    await expect(page.locator("p[role=alert]")).toContainText("implantação em andamento");
  });
});
