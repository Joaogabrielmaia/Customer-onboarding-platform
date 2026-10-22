import { beforeAll, describe, expect, it } from "vitest";
import { ForbiddenError, RuleError, ValidationError } from "@/domain/errors";
import { archiveTemplate, getTemplate, listTemplates, saveTemplate } from "@/server/services/templates";
import { createDeployment } from "@/server/services/deployments";
import { resetWithSeed, type Seeded } from "./helpers";

let s: Seeded;
beforeAll(async () => {
  s = await resetWithSeed();
});

const validTemplate = {
  name: "Modelo de teste",
  description: "Usado só nos testes",
  stages: [
    {
      name: "Dados do cliente",
      tasks: [
        { title: "Receber planilha de produtos", offsetDays: 7, assigneeKind: "CLIENT", required: true, visibleToClient: true },
        { title: "Importar produtos", offsetDays: 10, assigneeKind: "IMPLEMENTER", required: true, visibleToClient: false },
      ],
    },
  ],
};

// TC-07 (RF-04) e TC-08 (RF-05)
describe("modelos de implantação", () => {
  it("o admin cria um modelo com etapa e tarefas na ordem informada (US-04 CA1)", async () => {
    const template = await saveTemplate(s.camila, null, validTemplate);
    expect(template.stages).toHaveLength(1);
    const [first, second] = template.stages[0]!.tasks;
    expect(first).toMatchObject({ title: "Receber planilha de produtos", offsetDays: 7, assigneeKind: "CLIENT", required: true, position: 0 });
    expect(second).toMatchObject({ title: "Importar produtos", position: 1, visibleToClient: false });
  });

  it("substitui a estrutura ao editar, mantendo o mesmo modelo", async () => {
    const created = await saveTemplate(s.camila, null, validTemplate);
    const edited = await saveTemplate(s.camila, created.id, {
      ...validTemplate,
      stages: [{ name: "Única etapa", tasks: [{ title: "Só uma tarefa", offsetDays: 3, assigneeKind: "ADMIN", required: false, visibleToClient: false }] }],
    });
    expect(edited.id).toBe(created.id);
    expect(edited.stages.map((st) => st.name)).toEqual(["Única etapa"]);
    expect(edited.stages[0]!.tasks).toHaveLength(1);
  });

  it("recusa prazo negativo, sem etapas e título vazio (US-04 CA2, TC-31)", async () => {
    const negative = await saveTemplate(s.camila, null, {
      ...validTemplate,
      stages: [{ name: "E", tasks: [{ title: "T", offsetDays: -1, assigneeKind: "CLIENT", required: true, visibleToClient: true }] }],
    }).catch((e) => e);
    expect(negative).toBeInstanceOf(ValidationError);
    expect(negative.fieldErrors["stages.0.tasks.0.offsetDays"]).toBe("O prazo não pode ser negativo.");

    await expect(saveTemplate(s.camila, null, { ...validTemplate, stages: [] })).rejects.toBeInstanceOf(ValidationError);
    await expect(
      saveTemplate(s.camila, null, {
        ...validTemplate,
        stages: [{ name: "E", tasks: [{ title: "  ", offsetDays: 1, assigneeKind: "CLIENT", required: true, visibleToClient: true }] }],
      }),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it("o implantador lê os modelos, mas não os altera (US-04 CA3)", async () => {
    expect((await listTemplates(s.diego)).length).toBeGreaterThanOrEqual(3);
    const [any] = await listTemplates(s.diego);
    await expect(getTemplate(s.diego, any!.id)).resolves.toBeDefined();
    await expect(saveTemplate(s.diego, null, validTemplate)).rejects.toBeInstanceOf(ForbiddenError);
    await expect(saveTemplate(s.diego, any!.id, validTemplate)).rejects.toBeInstanceOf(ForbiddenError);
    await expect(archiveTemplate(s.diego, any!.id)).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("modelo arquivado some da lista e não pode iniciar implantação (RN-16)", async () => {
    const template = await saveTemplate(s.camila, null, validTemplate);
    await archiveTemplate(s.camila, template.id);
    expect((await listTemplates(s.diego)).map((t) => t.id)).not.toContain(template.id);
    await expect(
      createDeployment(s.diego, { clientId: s.clients.costaLima, templateId: template.id, implementerId: s.diego.id, kickoffDate: "2026-11-02" }),
    ).rejects.toBeInstanceOf(RuleError);
  });
});
