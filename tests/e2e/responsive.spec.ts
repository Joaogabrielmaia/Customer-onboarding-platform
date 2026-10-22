import { expect, test } from "@playwright/test";
import { ADMIN, login, openDeployment } from "./helpers";

test.use({ viewport: { width: 390, height: 844 } });

const pages = ["/", "/implantacoes", "/pendencias", "/clientes", "/modelos", "/modelos/novo", "/usuarios", "/configuracoes", "/implantacoes/nova"];

test("nenhuma tela interna tem rolagem horizontal em 390 px", async ({ page }) => {
  await login(page, ADMIN);
  const withOverflow: string[] = [];
  const overflow = () => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

  for (const url of pages) {
    await page.goto(url);
    if ((await overflow()) > 0) withOverflow.push(url);
  }
  await openDeployment(page, "Distribuidora Santa Rita Alimentos");
  if ((await overflow()) > 0) withOverflow.push("detalhe da implantação");
  await page.getByRole("link", { name: "Histórico" }).click();
  await expect(page.getByRole("list", { name: "Histórico de alterações" })).toBeVisible();
  if ((await overflow()) > 0) withOverflow.push("histórico");

  expect(withOverflow).toEqual([]);
});
