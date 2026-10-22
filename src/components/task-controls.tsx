"use client";

import { useRef } from "react";
import { addCommentAction, updateTaskScheduleAction, updateTaskStatusAction } from "@/app/actions/deployments";
import { statusLabel } from "@/lib/labels";
import type { TaskStatus } from "@/generated/prisma/enums";
import { ActionForm, Field, FormSuccess, SelectField, SubmitButton, TextAreaField } from "./form";

/** Seletor de status que salva ao escolher uma opção. */
export function TaskStatusSelect({ taskId, title, status, required }: { taskId: string; title: string; status: TaskStatus; required: boolean }) {
  const formRef = useRef<HTMLFormElement>(null);
  const options = (Object.keys(statusLabel) as TaskStatus[]).filter((s) => s !== "NOT_APPLICABLE" || !required);
  return (
    <form ref={formRef} action={updateTaskStatusAction}>
      <input type="hidden" name="taskId" value={taskId} />
      <select
        name="status"
        defaultValue={status}
        aria-label={`Status da tarefa ${title}`}
        onChange={() => formRef.current?.requestSubmit()}
        className="rounded-md border border-slate-400 bg-white px-2 py-1 text-sm"
      >
        {options.map((s) => <option key={s} value={s}>{statusLabel[s]}</option>)}
      </select>
    </form>
  );
}

export function ScheduleForm({
  taskId, dueDate, assigneeId, canPickAssignee, people,
}: {
  taskId: string;
  dueDate: string;
  assigneeId: string | null;
  canPickAssignee: boolean;
  people: { id: string; name: string }[];
}) {
  return (
    <ActionForm action={updateTaskScheduleAction} submit={<SubmitButton variant="secondary">Salvar ajuste</SubmitButton>} className="space-y-3">
      <input type="hidden" name="taskId" value={taskId} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field name="dueDate" label="Novo prazo" type="date" defaultValue={dueDate} />
        {canPickAssignee && (
          <SelectField name="assigneeId" label="Responsável" defaultValue={assigneeId ?? ""} options={people.map((p) => ({ value: p.id, label: p.name }))} placeholder="Manter" />
        )}
      </div>
      <Field name="reason" label="Motivo da alteração" hint="Obrigatório se o prazo mudar. Fica registrado no histórico." />
      <FormSuccess>Ajuste salvo.</FormSuccess>
    </ActionForm>
  );
}

export function CommentForm({ taskId }: { taskId: string }) {
  return (
    <ActionForm action={addCommentAction} resetOnSuccess submit={<SubmitButton variant="secondary" pendingLabel="Enviando...">Comentar</SubmitButton>} className="space-y-2">
      <input type="hidden" name="taskId" value={taskId} />
      <TextAreaField name="body" label="Novo comentário (interno, o cliente não vê)" rows={2} />
      <FormSuccess>Comentário registrado.</FormSuccess>
    </ActionForm>
  );
}
