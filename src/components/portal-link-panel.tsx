"use client";

import { useActionState, useState } from "react";
import { createPortalLinkAction, revokePortalLinkAction } from "@/app/actions/deployments";
import type { ActionState } from "@/lib/action-state";
import { SubmitButton } from "./form";
import { Notice } from "./ui";

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          setCopied(false);
        }
      }}
      className="rounded-md border border-slate-400 bg-white px-3 py-1.5 text-sm font-medium hover:bg-slate-100"
    >
      {copied ? "Copiado!" : label}
    </button>
  );
}

/** Gera, mostra uma vez e revoga o link do cliente (T08, RF-15 e RF-19). */
export function PortalLinkPanel({ deploymentId, activeUntil, expiresLabel }: { deploymentId: string; activeUntil: string | null; expiresLabel: string | null }) {
  const [created, createAction] = useActionState<ActionState, FormData>(createPortalLinkAction, {});
  const [revoked, revokeAction] = useActionState<ActionState, FormData>(revokePortalLinkAction, {});
  const link = created.data;
  const error = created.error ?? revoked.error;

  return (
    <div className="space-y-3">
      {error && <p role="alert" className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-900">{error}</p>}

      {link ? (
        <div className="space-y-2 rounded-md border border-emerald-300 bg-emerald-50 p-3">
          <p className="text-sm font-semibold text-emerald-950">Link gerado. Copie agora: por segurança, ele não será mostrado de novo.</p>
          <input readOnly aria-label="Link do cliente" value={link.url} onFocus={(e) => e.currentTarget.select()} className="block w-full rounded-md border border-slate-400 bg-white px-3 py-2 text-sm" />
          <div className="flex flex-wrap gap-2">
            <CopyButton text={link.url ?? ""} label="Copiar link" />
            <CopyButton text={link.message ?? ""} label="Copiar mensagem pronta" />
          </div>
          <p className="whitespace-pre-wrap rounded-md bg-white p-2 text-sm text-slate-800">{link.message}</p>
        </div>
      ) : (
        <p className="text-sm text-slate-800">
          {activeUntil
            ? `Há um link ativo, válido até ${expiresLabel}. O endereço não é guardado em texto, então só dá para ver ao gerar um novo.`
            : "Nenhum link ativo. O cliente acompanha a implantação por um link, sem criar conta."}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <form action={createAction}>
          <input type="hidden" name="deploymentId" value={deploymentId} />
          <SubmitButton variant="secondary" pendingLabel="Gerando...">{activeUntil || link ? "Gerar novo link (revoga o anterior)" : "Gerar link do cliente"}</SubmitButton>
        </form>
        {(activeUntil || link) && !revoked.ok && (
          <form action={revokeAction}>
            <input type="hidden" name="deploymentId" value={deploymentId} />
            <SubmitButton variant="danger" pendingLabel="Revogando...">Revogar link</SubmitButton>
          </form>
        )}
      </div>
      {revoked.ok && <Notice tone="success">Link revogado. O endereço antigo não abre mais.</Notice>}
    </div>
  );
}
