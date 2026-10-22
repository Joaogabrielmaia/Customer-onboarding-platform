import { beforeAll, describe, expect, it } from "vitest";
import { NotFoundError } from "@/domain/errors";
import { db } from "@/server/db";
import { createDeployment } from "@/server/services/deployments";
import { exportDeploymentCsv, exportDeploymentsCsv } from "@/server/services/reports";
import { saveTemplate } from "@/server/services/templates";
import { deploymentOf, NOW, resetWithSeed, type Seeded } from "./helpers";

let s: Seeded;
beforeAll(async () => {
  s = await resetWithSeed();
});

const lines = (csv: string) => csv.split("\r\n").filter((l) => l !== "");

// TC-36 e TC-37 (v1.1, RF-20)
describe("exportação da implantação em CSV", () => {
  it("gera cabeçalho e uma linha por tarefa, com atraso e situação", async () => {
    const d = await deploymentOf("Santa Rita");
    const file = await exportDeploymentCsv(s.diego, d.id, NOW);
    const rows = lines(file.content);

    expect(rows[0]).toBe("Etapa;Tarefa;Responsável;Prazo;Prazo original;Status;Obrigatória;Visível ao cliente;Concluída em;Situação do prazo;Dias de atraso");
    expect(rows).toHaveLength(1 + d.tasks.length);
    expect(file.filename).toBe("implantacao-distribuidora-santa-rita-alimentos-2026-10-22.csv");

    const fiscal = rows.find((r) => r.includes(";Parametrização fiscal;"))!;
    expect(fiscal).toContain("Diego Ferreira");
    expect(fiscal).toContain("Em andamento");
    expect(fiscal).toContain("Atrasada (equipe)");
    // prazo original diferente do atual (o prazo foi adiado no seed)
    const cells = fiscal.split(";");
    expect(cells[3]).not.toBe(cells[4]);
    // tarefa do cliente já concluída: sem atraso
    const clientTask = rows.find((r) => r.includes(";Receber planilha de produtos;"))!;
    expect(clientTask).toContain("Cliente");
    expect(clientTask).toContain("Concluída");
    expect(clientTask.endsWith(";0")).toBe(true);
  });

  it("neutraliza fórmulas vindas de títulos e nomes digitados por usuários", async () => {
    const template = await saveTemplate(s.camila, null, {
      name: "Modelo com texto malicioso",
      stages: [{ name: "=Etapa", tasks: [{ title: '=HYPERLINK("http://exemplo.invalid")', offsetDays: 1, assigneeKind: "CLIENT", required: true, visibleToClient: true }] }],
    });
    const created = await createDeployment(s.diego, { clientId: s.clients.costaLima, templateId: template.id, implementerId: s.diego.id, kickoffDate: "2026-10-20" });
    const rows = lines((await exportDeploymentCsv(s.diego, created.id, NOW)).content);
    expect(rows[1]).toMatch(/^'=Etapa;"'=HYPERLINK/);
  });

  it("qualquer usuário interno exporta; implantação inexistente dá erro", async () => {
    const d = await deploymentOf("Vale Verde");
    await expect(exportDeploymentCsv(s.patricia, d.id, NOW)).resolves.toBeDefined();
    await expect(exportDeploymentCsv(s.diego, "inexistente", NOW)).rejects.toBeInstanceOf(NotFoundError);
  });

  it("não inclui comentários nem o histórico (só dados da tarefa)", async () => {
    const d = await deploymentOf("Santa Rita");
    const { content } = await exportDeploymentCsv(s.diego, d.id, NOW);
    expect(content).not.toContain("módulo de entregas");
    expect(content).not.toContain("férias");
  });
});

describe("exportação da lista de implantações em CSV", () => {
  it("lista todas as implantações, uma por linha", async () => {
    const file = await exportDeploymentsCsv(s.diego, {}, NOW);
    const rows = lines(file.content);
    expect(rows[0]).toBe("Empresa;Implantador;Situação;Progresso (%);Kickoff;Concluída em;Maior atraso da equipe (dias);Tarefas atrasadas (equipe);Tarefas atrasadas (cliente);Próximo prazo");
    expect(rows).toHaveLength(1 + (await db.deployment.count()));
    expect(file.filename).toBe("implantacoes-2026-10-22.csv");
  });

  it("respeita os filtros", async () => {
    const late = lines((await exportDeploymentsCsv(s.diego, { status: "late" }, NOW)).content);
    expect(late).toHaveLength(1 + 2);
    expect(late.slice(1).every((r) => r.includes(";Atrasada;"))).toBe(true);
    const done = lines((await exportDeploymentsCsv(s.diego, { status: "completed" }, NOW)).content);
    expect(done).toHaveLength(1 + 2);
  });
});
