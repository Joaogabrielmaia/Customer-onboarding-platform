"use client";

import { useState } from "react";
import { createDeploymentAction } from "@/app/actions/deployments";
import { formatBR } from "@/domain/dates";
import { computeDueDate } from "@/domain/deadlines";
import { ActionForm, SelectField, SubmitButton, inputClass, useFormState } from "./form";

interface TemplateOption {
  id: string;
  name: string;
  tasks: { title: string; offsetDays: number; stageName: string }[];
}

function TemplateAndKickoff({ templates, defaultKickoff }: { templates: TemplateOption[]; defaultKickoff: string }) {
  const state = useFormState();
  const [templateId, setTemplateId] = useState(state.values?.templateId ?? "");
  const [kickoff, setKickoff] = useState(state.values?.kickoffDate ?? defaultKickoff);
  const template = templates.find((t) => t.id === templateId);
  const kickoffDate = /^\d{4}-\d{2}-\d{2}$/.test(kickoff) ? new Date(`${kickoff}T00:00:00Z`) : null;
  const valid = kickoffDate && !Number.isNaN(kickoffDate.getTime());

  return (
    <>
      <div>
        <label htmlFor="templateId" className="mb-1 block text-sm font-medium">Modelo de implantação <span aria-hidden="true" className="text-red-700">*</span></label>
        <select id="templateId" name="templateId" value={templateId} onChange={(e) => setTemplateId(e.target.value)} className={inputClass} aria-invalid={state.fieldErrors?.templateId ? true : undefined}>
          <option value="">Escolha o modelo</option>
          {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        {state.fieldErrors?.templateId && <p className="mt-1 text-sm font-medium text-red-800">{state.fieldErrors.templateId}</p>}
      </div>
      <div>
        <label htmlFor="kickoffDate" className="mb-1 block text-sm font-medium">Data do kickoff <span aria-hidden="true" className="text-red-700">*</span></label>
        <input id="kickoffDate" name="kickoffDate" type="date" value={kickoff} onChange={(e) => setKickoff(e.target.value)} className={inputClass} aria-invalid={state.fieldErrors?.kickoffDate ? true : undefined} />
        {state.fieldErrors?.kickoffDate && <p className="mt-1 text-sm font-medium text-red-800">{state.fieldErrors.kickoffDate}</p>}
      </div>

      {template && (
        <section aria-label="Prévia dos prazos" className="rounded-md border border-slate-300 bg-slate-50 p-3">
          <p className="mb-2 text-sm font-semibold">Prévia dos prazos (D+n a partir do kickoff)</p>
          {valid ? (
            <ul className="max-h-64 space-y-1 overflow-y-auto text-sm">
              {template.tasks.map((t, i) => (
                <li key={i} className="flex justify-between gap-3">
                  <span>{t.title}</span>
                  <span className="shrink-0 font-medium">D+{t.offsetDays} → {formatBR(computeDueDate(kickoffDate!, t.offsetDays))}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-700">Informe a data do kickoff para ver os prazos.</p>
          )}
        </section>
      )}
    </>
  );
}

export function NewDeploymentForm({
  clients,
  templates,
  people,
  defaultClientId,
  defaultImplementerId,
  defaultKickoff,
}: {
  clients: { id: string; companyName: string }[];
  templates: TemplateOption[];
  people: { id: string; name: string }[];
  defaultClientId?: string;
  defaultImplementerId: string;
  defaultKickoff: string;
}) {
  return (
    <ActionForm action={createDeploymentAction} submit={<SubmitButton pendingLabel="Criando...">Criar implantação</SubmitButton>}>
      <SelectField
        name="clientId" label="Cliente" required placeholder="Escolha o cliente" defaultValue={defaultClientId}
        options={clients.map((c) => ({ value: c.id, label: c.companyName }))}
      />
      <TemplateAndKickoff templates={templates} defaultKickoff={defaultKickoff} />
      <SelectField
        name="implementerId" label="Implantador responsável" required defaultValue={defaultImplementerId}
        options={people.map((p) => ({ value: p.id, label: p.name }))}
      />
    </ActionForm>
  );
}

