import { expect, type Page } from "@playwright/test";

export const ADMIN = { email: "admin@rotafacil.example", password: "Demo-Admin-2026" };
export const DIEGO = { email: "implantador@rotafacil.example", password: "Demo-Implantador-2026" };
export const LARISSA = { email: "larissa@rotafacil.example", password: "Demo-Implantador-2026" };

export async function login(page: Page, who: { email: string; password: string }) {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill(who.email);
  await page.getByLabel("Senha").fill(who.password);
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page.getByRole("heading", { name: "Painel", level: 1 })).toBeVisible();
}

/** Abre a implantação de um cliente a partir da lista de implantações. */
export async function openDeployment(page: Page, companyName: string) {
  await page.goto("/implantacoes");
  await page.getByRole("link", { name: companyName }).click();
  await expect(page.getByRole("heading", { name: companyName, level: 1 })).toBeVisible();
}
