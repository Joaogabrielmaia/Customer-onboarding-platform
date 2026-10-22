import { expect, test, type Page } from "@playwright/test";
import { DIEGO, LARISSA, login, openDeployment } from "./helpers";

const COMPANY = "Costa Lima Embalagens e Distribuição";
const task = (page: Page, title: string) => page.getByRole("listitem").filter({ hasText: title }).first();

test.describe.serial("implantação: da criação ao histórico", () => {
  test("cria uma implantação a partir do modelo, com prévia das datas", async ({ page }) => {
    await login(page, DIEGO);
    await page.goto("/clientes");
    await page.getByRole("link", { name: COMPANY }).click();
    await page.getByRole("link", { name: "Iniciar implantação" }).click();

    await page.getByLabel("Modelo de implantação").selectOption({ label: "Implantação Essencial (enxuta)" });
    await page.getByLabel("Data do kickoff").fill("2026-03-02");
    const preview = page.getByRole("region", { name: "Prévia dos prazos" });
    await expect(preview).toContainText("Receber planilha de produtos");
    await expect(preview).toContainText("D+7 → 09/03/2026");
    await expect(preview).toContainText("D+10 → 12/03/2026");

    await page.getByRole("button", { name: "Criar implantação" }).click();
    await expect(page.getByRole("heading", { name: COMPANY, level: 1 })).toBeVisible();
    await expect(page.getByText("0 de 9 tarefas concluídas")).toBeVisible();
    await expect(task(page, "Receber planilha de produtos")).toContainText("Prazo 09/03/2026");
    await expect(task(page, "Receber planilha de produtos")).toContainText("Responsável: cliente");
  });

  test("atualiza o status e o progresso é recalculado", async ({ page }) => {
    await login(page, DIEGO);
    await openDeployment(page, COMPANY);
    await page.getByLabel("Status da tarefa Realizar reunião de kickoff").selectOption("Concluída");
    await expect(page.getByText("1 de 9 tarefas concluídas")).toBeVisible();
    await expect(page.getByRole("progressbar", { name: "Progresso da implantação" })).toHaveAttribute("aria-valuenow", "11");
  });

  test("comenta numa tarefa", async ({ page }) => {
    await login(page, DIEGO);
    await openDeployment(page, COMPANY);
    const item = task(page, "Importar produtos e clientes");
    await item.getByText(/Detalhes e comentários/).click();
    await item.getByLabel(/Novo comentário/).fill("Combinado por telefone: importar também os clientes inativos.");
    await item.getByRole("button", { name: "Comentar" }).click();
    await expect(item.getByText("Comentário registrado.")).toBeVisible();
    await expect(item.getByText("Combinado por telefone: importar também os clientes inativos.")).toBeVisible();
    await expect(item.getByText(/Detalhes e comentários \(1\)/)).toBeVisible();
  });

  test("exige motivo para mudar o prazo e mostra o prazo original", async ({ page }) => {
    await login(page, DIEGO);
    await openDeployment(page, COMPANY);
    const item = task(page, "Parametrização fiscal básica");
    await item.getByText(/Detalhes e comentários/).click();
    await item.getByRole("button", { name: "Salvar ajuste" }).click();
    await expect(item.locator("p[role=alert]")).toContainText("Nenhuma alteração para salvar");
    await expect(item.getByText("Ajuste salvo.")).toHaveCount(0);

    await item.getByLabel("Novo prazo").fill("2026-03-20");
    await item.getByRole("button", { name: "Salvar ajuste" }).click();
    await expect(item.getByText("Informe o motivo da alteração do prazo.").first()).toBeVisible();

    await item.getByLabel(/Motivo da alteração/).fill("Contador do cliente de férias");
    await item.getByRole("button", { name: "Salvar ajuste" }).click();
    await expect(item.getByText("Ajuste salvo.")).toBeVisible();
    await expect(item).toContainText("Prazo 20/03/2026 (original 16/03/2026)");
  });

  test("o histórico registra o que aconteceu, com autor e motivo", async ({ page }) => {
    await login(page, DIEGO);
    await openDeployment(page, COMPANY);
    await page.getByRole("link", { name: "Histórico" }).click();
    const history = page.getByRole("list", { name: "Histórico de alterações" });
    await expect(history).toContainText("prazo de 16/03/2026 para 20/03/2026. Motivo: Contador do cliente de férias");
    await expect(history).toContainText('"Realizar reunião de kickoff": status de Pendente para Concluída');
    await expect(history).toContainText("Comentário em \"Importar produtos e clientes\"");
    await expect(history).toContainText("Implantação criada a partir do modelo");
    await expect(history).toContainText("Diego Ferreira");
  });

  test("outro implantador só consulta e comenta; não altera nem gera link", async ({ page }) => {
    await login(page, LARISSA);
    await openDeployment(page, COMPANY);
    await expect(page.getByLabel("Status da tarefa Realizar reunião de kickoff")).toHaveCount(0);
    await expect(page.getByRole("button", { name: /Gerar/ })).toHaveCount(0);
    await expect(page.getByText(/Só o implantador responsável/)).toBeVisible();
    const item = task(page, "Enviar checklist de dados necessários");
    await item.getByText(/Detalhes e comentários/).click();
    await expect(item.getByRole("button", { name: "Comentar" })).toBeVisible();
    await expect(item.getByRole("button", { name: "Salvar ajuste" })).toHaveCount(0);
  });
});
