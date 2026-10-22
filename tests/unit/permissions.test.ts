import { describe, expect, it } from "vitest";
import { ForbiddenError } from "@/domain/errors";
import { assertCan, can, type Action } from "@/domain/permissions";

const admin = { id: "u-admin", role: "ADMIN" as const };
const diego = { id: "u-diego", role: "IMPLEMENTER" as const };
const patricia = { id: "u-patricia", role: "IMPLEMENTER" as const };

// Implantação do Diego; tarefa sem responsável específico.
const diegosDeployment = { deploymentImplementerId: diego.id, taskAssigneeId: null };

describe("can (RN-12)", () => {
  it("o admin pode tudo", () => {
    const actions: Action[] = [
      "user:manage", "settings:update", "template:manage", "template:read", "client:manage",
      "deployment:create", "deployment:read", "task:update-status", "task:update-schedule",
      "comment:create", "portal-link:manage",
    ];
    for (const action of actions) expect(can(admin, action, diegosDeployment)).toBe(true);
  });

  it("o implantador não faz ações exclusivas do admin", () => {
    expect(can(diego, "user:manage")).toBe(false);
    expect(can(diego, "settings:update")).toBe(false);
    expect(can(diego, "template:manage")).toBe(false);
  });

  it("o implantador lê modelos, gerencia clientes, cria implantações e comenta em qualquer uma", () => {
    for (const action of ["template:read", "client:manage", "deployment:create", "deployment:read"] as const) {
      expect(can(patricia, action)).toBe(true);
    }
    expect(can(patricia, "comment:create", diegosDeployment)).toBe(true);
  });

  it("só o responsável pela implantação altera status, prazo e link", () => {
    expect(can(diego, "task:update-status", diegosDeployment)).toBe(true);
    expect(can(diego, "task:update-schedule", diegosDeployment)).toBe(true);
    expect(can(diego, "portal-link:manage", diegosDeployment)).toBe(true);

    expect(can(patricia, "task:update-status", diegosDeployment)).toBe(false);
    expect(can(patricia, "task:update-schedule", diegosDeployment)).toBe(false);
    expect(can(patricia, "portal-link:manage", diegosDeployment)).toBe(false);
  });

  it("quem é responsável pela tarefa pode alterar o status dela, mas não o prazo", () => {
    const taskOfPatricia = { deploymentImplementerId: diego.id, taskAssigneeId: patricia.id };
    expect(can(patricia, "task:update-status", taskOfPatricia)).toBe(true);
    expect(can(patricia, "task:update-schedule", taskOfPatricia)).toBe(false);
  });

  it("sem informar o recurso, ações dependentes dele são negadas", () => {
    expect(can(diego, "task:update-status")).toBe(false);
  });
});

describe("assertCan", () => {
  it("lança ForbiddenError quando negado", () => {
    expect(() => assertCan(diego, "user:manage")).toThrow(ForbiddenError);
  });

  it("não lança quando permitido", () => {
    expect(() => assertCan(admin, "user:manage")).not.toThrow();
  });
});
