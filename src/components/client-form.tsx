import { formatCivil } from "@/domain/dates";
import { saveClientAction } from "@/app/actions/clients";
import { planLabel } from "@/lib/labels";
import type { Client } from "@/generated/prisma/client";
import { ActionForm, Field, SelectField, SubmitButton } from "./form";

const planOptions = Object.entries(planLabel).map(([value, label]) => ({ value, label }));

/** Formulário de cliente, usado para cadastrar e editar (T04). */
export function ClientForm({ client }: { client?: Client }) {
  return (
    <ActionForm action={saveClientAction} submit={<SubmitButton>{client ? "Salvar alterações" : "Cadastrar cliente"}</SubmitButton>}>
      {client && <input type="hidden" name="id" value={client.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="companyName" label="Empresa" required defaultValue={client?.companyName} />
        <Field name="cnpj" label="CNPJ" defaultValue={client?.cnpj ?? ""} hint="Opcional. Na demonstração, use sempre um CNPJ fictício." />
        <Field name="contactName" label="Nome do contato" required defaultValue={client?.contactName} />
        <Field name="contactEmail" label="E-mail do contato" type="email" required defaultValue={client?.contactEmail} />
        <Field name="contactPhone" label="Telefone do contato" type="tel" defaultValue={client?.contactPhone ?? ""} />
        <SelectField name="plan" label="Plano" required options={planOptions} placeholder="Escolha o plano" defaultValue={client?.plan} />
        <Field name="contractDate" label="Data do contrato" type="date" required defaultValue={client ? formatCivil(client.contractDate) : ""} />
      </div>
    </ActionForm>
  );
}
