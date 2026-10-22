"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { saveTemplateAction } from "@/app/actions/templates";
import { assigneeKindLabel } from "@/lib/labels";
import { inputClass } from "./form";
import type { AssigneeKind } from "@/generated/prisma/enums";

interface TaskDraft {
  title: string;
  offsetDays: string;
  assigneeKind: AssigneeKind;
  required: boolean;
  visibleToClient: boolean;
}
interface StageDraft {
  name: string;
  tasks: TaskDraft[];
}
export interface TemplateDraft {
  name: string;
  description: string;
  stages: StageDraft[];
}

const emptyTask = (): TaskDraft => ({ title: "", offsetDays: "0", assigneeKind: "IMPLEMENTER", required: true, visibleToClient: true });
const emptyStage = (): StageDraft => ({ name: "", tasks: [emptyTask()] });

function move<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length) return list;
  const copy = [...list];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item!);
  return copy;
}

export function TemplateEditor({ templateId, initial }: { templateId: string | null; initial?: TemplateDraft }) {
  const router = useRouter();
  const [draft, setDraft] = useState<TemplateDraft>(initial ?? { name: "", description: "", stages: [emptyStage()] });
  const [error, setError] = useState<string>();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();

  const setStage = (i: number, patch: Partial<StageDraft>) =>
    setDraft((d) => ({ ...d, stages: d.stages.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) }));
  const setTask = (si: number, ti: number, patch: Partial<TaskDraft>) =>
    setStage(si, { tasks: draft.stages[si]!.tasks.map((t, idx) => (idx === ti ? { ...t, ...patch } : t)) });

  function save() {
    setError(undefined);
    setFieldErrors({});
    startTransition(async () => {
      const payload = {
        name: draft.name,
        description: draft.description,
        stages: draft.stages.map((s) => ({
          name: s.name,
          tasks: s.tasks.map((t) => ({ ...t, offsetDays: t.offsetDays.trim() === "" ? Number.NaN : Number(t.offsetDays) })),
        })),
      };
      const result = await saveTemplateAction(templateId, payload);
      if (result.error) {
        const fields = result.fieldErrors ?? {};
        setFieldErrors(fields);
        setError(Object.keys(fields).length > 0 ? "Revise os campos destacados." : result.error);
        return;
      }
      router.push("/modelos");
      router.refresh();
    });
  }

  const err = (key: string) => fieldErrors[key];

  return (
    <div className="space-y-6">
      {error && <p role="alert" className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-900">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="tpl-name" className="mb-1 block text-sm font-medium">Nome do modelo *</label>
          <input id="tpl-name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className={inputClass} aria-invalid={err("name") ? true : undefined} />
          {err("name") && <p className="mt-1 text-sm font-medium text-red-800">{err("name")}</p>}
        </div>
        <div>
          <label htmlFor="tpl-desc" className="mb-1 block text-sm font-medium">Descrição</label>
          <input id="tpl-desc" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className={inputClass} />
        </div>
      </div>

      {err("stages") && <p className="text-sm font-medium text-red-800">{err("stages")}</p>}

      {draft.stages.map((stage, si) => (
        <fieldset key={si} className="rounded-lg border border-slate-300 bg-white p-4">
          <legend className="px-1 text-sm font-semibold text-slate-900">Etapa {si + 1}</legend>
          <div className="flex flex-wrap items-end gap-2">
            <div className="min-w-56 flex-1">
              <label htmlFor={`stage-${si}`} className="mb-1 block text-sm font-medium">Nome da etapa *</label>
              <input id={`stage-${si}`} value={stage.name} onChange={(e) => setStage(si, { name: e.target.value })} className={inputClass} aria-invalid={err(`stages.${si}.name`) ? true : undefined} />
              {err(`stages.${si}.name`) && <p className="mt-1 text-sm font-medium text-red-800">{err(`stages.${si}.name`)}</p>}
            </div>
            <button type="button" onClick={() => setDraft((d) => ({ ...d, stages: move(d.stages, si, si - 1) }))} disabled={si === 0} className="rounded-md border border-slate-400 px-3 py-2 text-sm disabled:opacity-40" aria-label={`Subir etapa ${si + 1}`}>↑</button>
            <button type="button" onClick={() => setDraft((d) => ({ ...d, stages: move(d.stages, si, si + 1) }))} disabled={si === draft.stages.length - 1} className="rounded-md border border-slate-400 px-3 py-2 text-sm disabled:opacity-40" aria-label={`Descer etapa ${si + 1}`}>↓</button>
            <button type="button" onClick={() => setDraft((d) => ({ ...d, stages: d.stages.filter((_, i) => i !== si) }))} disabled={draft.stages.length === 1} className="rounded-md border border-red-400 px-3 py-2 text-sm text-red-900 disabled:opacity-40">Remover etapa</button>
          </div>
          {err(`stages.${si}.tasks`) && <p className="mt-2 text-sm font-medium text-red-800">{err(`stages.${si}.tasks`)}</p>}

          <ul className="mt-4 space-y-3">
            {stage.tasks.map((task, ti) => (
              <li key={ti} className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <div className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr]">
                  <div>
                    <label htmlFor={`t-${si}-${ti}-title`} className="mb-1 block text-sm font-medium">Tarefa *</label>
                    <input id={`t-${si}-${ti}-title`} value={task.title} onChange={(e) => setTask(si, ti, { title: e.target.value })} className={inputClass} aria-invalid={err(`stages.${si}.tasks.${ti}.title`) ? true : undefined} />
                    {err(`stages.${si}.tasks.${ti}.title`) && <p className="mt-1 text-sm font-medium text-red-800">{err(`stages.${si}.tasks.${ti}.title`)}</p>}
                  </div>
                  <div>
                    <label htmlFor={`t-${si}-${ti}-offset`} className="mb-1 block text-sm font-medium">Prazo (D+n) *</label>
                    <input id={`t-${si}-${ti}-offset`} type="number" min={0} value={task.offsetDays} onChange={(e) => setTask(si, ti, { offsetDays: e.target.value })} className={inputClass} aria-invalid={err(`stages.${si}.tasks.${ti}.offsetDays`) ? true : undefined} />
                    {err(`stages.${si}.tasks.${ti}.offsetDays`) && <p className="mt-1 text-sm font-medium text-red-800">{err(`stages.${si}.tasks.${ti}.offsetDays`)}</p>}
                  </div>
                  <div>
                    <label htmlFor={`t-${si}-${ti}-kind`} className="mb-1 block text-sm font-medium">Responsável padrão</label>
                    <select id={`t-${si}-${ti}-kind`} value={task.assigneeKind} onChange={(e) => setTask(si, ti, { assigneeKind: e.target.value as AssigneeKind })} className={inputClass}>
                      {(Object.keys(assigneeKindLabel) as AssigneeKind[]).map((k) => <option key={k} value={k}>{assigneeKindLabel[k]}</option>)}
                    </select>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
                  <label className="flex items-center gap-2"><input type="checkbox" className="size-4" checked={task.required} onChange={(e) => setTask(si, ti, { required: e.target.checked })} /> Obrigatória</label>
                  <label className="flex items-center gap-2"><input type="checkbox" className="size-4" checked={task.visibleToClient} onChange={(e) => setTask(si, ti, { visibleToClient: e.target.checked })} /> Visível ao cliente</label>
                  <span className="ml-auto flex gap-2">
                    <button type="button" onClick={() => setStage(si, { tasks: move(stage.tasks, ti, ti - 1) })} disabled={ti === 0} className="rounded-md border border-slate-400 px-2 py-1 disabled:opacity-40" aria-label={`Subir tarefa ${ti + 1} da etapa ${si + 1}`}>↑</button>
                    <button type="button" onClick={() => setStage(si, { tasks: move(stage.tasks, ti, ti + 1) })} disabled={ti === stage.tasks.length - 1} className="rounded-md border border-slate-400 px-2 py-1 disabled:opacity-40" aria-label={`Descer tarefa ${ti + 1} da etapa ${si + 1}`}>↓</button>
                    <button type="button" onClick={() => setStage(si, { tasks: stage.tasks.filter((_, i) => i !== ti) })} disabled={stage.tasks.length === 1} className="rounded-md border border-red-400 px-2 py-1 text-red-900 disabled:opacity-40">Remover</button>
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => setStage(si, { tasks: [...stage.tasks, emptyTask()] })} className="mt-3 rounded-md border border-slate-400 bg-white px-3 py-1.5 text-sm font-medium hover:bg-slate-100">+ Tarefa</button>
        </fieldset>
      ))}

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setDraft((d) => ({ ...d, stages: [...d.stages, emptyStage()] }))} className="rounded-md border border-slate-400 bg-white px-4 py-2 font-medium hover:bg-slate-100">+ Etapa</button>
        <button type="button" onClick={save} disabled={pending} className="rounded-md bg-indigo-700 px-4 py-2 font-medium text-white hover:bg-indigo-800 disabled:opacity-60">
          {pending ? "Salvando..." : "Salvar modelo"}
        </button>
      </div>
    </div>
  );
}
