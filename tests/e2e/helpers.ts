import { expect, type Page } from "@playwright/test";
import { SEED_ADMIN_PASSWORD, SEED_USER_PASSWORD } from "../../src/server/seed-data";

export const ADMIN = { email: "admin@rotafacil.example", password: SEED_ADMIN_PASSWORD };
export const DIEGO = { email: "implantador@rotafacil.example", password: SEED_USER_PASSWORD };
export const LARISSA = { email: "larissa@rotafacil.example", password: SEED_USER_PASSWORD };

export async function login(page: Page, who: { email: string; password: string }) {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill(who.email);
  await page.getByLabel("Senha").fill(who.password);
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page.getByRole("heading", { name: "Painel", level: 1 })).toBeVisible();
}

export async function openDeployment(page: Page, companyName: string) {
  await page.goto("/implantacoes");
  await page.getByRole("link", { name: companyName }).click();
  await expect(page.getByRole("heading", { name: companyName, level: 1 })).toBeVisible();
}
