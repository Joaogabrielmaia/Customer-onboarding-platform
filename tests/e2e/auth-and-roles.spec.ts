import { expect, test } from "@playwright/test";
import { ADMIN, DIEGO, login } from "./helpers";

// TC-02 (RF-01, RF-02)
test.describe("login e papéis", () => {
  test("recusa senha errada com mensagem genérica", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("E-mail").fill(ADMIN.email);
    await page.getByLabel("Senha").fill("senha-errada-123");
    await page.getByRole("button", { name: "Entrar" }).click();
    await expect(page.locator("p[role=alert]")).toHaveText("E-mail ou senha incorretos.");
    await expect(page).toHaveURL(/\/login$/);
    // O e-mail digitado é mantido; a senha não.
    await expect(page.getByLabel("E-mail")).toHaveValue(ADMIN.email);
    await expect(page.getByLabel("Senha")).toHaveValue("");
  });

  test("entra, mantém a sessão ao recarregar e sai", async ({ page }) => {
    await login(page, ADMIN);
    await page.reload();
    await expect(page.getByRole("heading", { name: "Painel", level: 1 })).toBeVisible();
    await page.getByRole("button", { name: "Sair" }).click();
    await expect(page).toHaveURL(/\/login$/);
    await page.goto("/");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("manda para o login quem abre uma página interna sem sessão (US-01 CA4)", async ({ page }) => {
    await page.goto("/clientes");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("o implantador não vê nem acessa as telas de administração", async ({ page }) => {
    await login(page, DIEGO);
    const nav = page.getByRole("navigation", { name: "Principal" });
    await expect(nav.getByRole("link", { name: "Usuários" })).toHaveCount(0);
    await expect(nav.getByRole("link", { name: "Configurações" })).toHaveCount(0);
    await page.goto("/usuarios");
    await expect(page).toHaveURL(/\/$/);
    await page.goto("/configuracoes");
    await expect(page).toHaveURL(/\/$/);
  });

  test("o administrador vê as telas de administração", async ({ page }) => {
    await login(page, ADMIN);
    await page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Usuários" }).click();
    await expect(page.getByRole("heading", { name: "Usuários", level: 1 })).toBeVisible();
    await expect(page.getByText("implantador@rotafacil.example")).toBeVisible();
  });

  test("o healthcheck responde com o banco disponível", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.status()).toBe(200);
    expect(await response.json()).toMatchObject({ status: "ok", database: "ok" });
  });
});
