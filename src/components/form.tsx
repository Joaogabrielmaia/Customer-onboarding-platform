"use client";

import { createContext, useContext, useActionState, useEffect, useId, useRef, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import type { ActionState } from "@/lib/action-state";

const FormStateContext = createContext<ActionState>({});

export const inputClass =
  "block w-full rounded-md border border-slate-400 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-500 aria-[invalid=true]:border-red-700";

export function SubmitButton({ children, pendingLabel = "Salvando...", variant = "primary" }: {
  children: ReactNode;
  pendingLabel?: string;
  variant?: "primary" | "secondary" | "danger";
}) {
  const { pending } = useFormStatus();
  const styles = {
    primary: "bg-indigo-700 text-white hover:bg-indigo-800",
    secondary: "border border-slate-400 bg-white text-slate-900 hover:bg-slate-100",
    danger: "bg-red-700 text-white hover:bg-red-800",
  }[variant];
  return (
    <button type="submit" disabled={pending} className={`rounded-md px-4 py-2 font-medium disabled:opacity-60 ${styles}`}>
      {pending ? pendingLabel : children}
    </button>
  );
}

export function ActionForm({
  action,
  children,
  submit,
  className,
  resetOnSuccess = false,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  children: ReactNode;
  submit?: ReactNode;
  className?: string;
  resetOnSuccess?: boolean;
}) {
  const [state, formAction] = useActionState(action, {} as ActionState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok && resetOnSuccess) formRef.current?.reset();
  }, [state, resetOnSuccess]);

  return (
    <FormStateContext.Provider value={state}>
      <form ref={formRef} action={formAction} className={className ?? "space-y-4"} noValidate>
        {state.error && (
          <p role="alert" className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-900">
            {Object.keys(state.fieldErrors ?? {}).length > 0 ? "Revise os campos destacados." : state.error}
          </p>
        )}
        {children}
        {submit !== null && <div className="pt-1">{submit ?? <SubmitButton>Salvar</SubmitButton>}</div>}
      </form>
    </FormStateContext.Provider>
  );
}

interface BaseFieldProps {
  name: string;
  label: string;
  hint?: string;
  required?: boolean;
  defaultValue?: string;
}

function useFieldState(name: string, defaultValue?: string) {
  const state = useContext(FormStateContext);
  const error = state.fieldErrors?.[name];
  const value = state.values?.[name] ?? defaultValue ?? "";
  return { error, value, nonce: state.nonce ?? 0 };
}

function FieldFrame({ id, label, hint, required, error, children }: BaseFieldProps & { id: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-900">
        {label}
        {required && <span aria-hidden="true" className="text-red-700"> *</span>}
      </label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="mt-1 text-sm text-slate-700">{hint}</p>}
      {error && <p id={`${id}-error`} className="mt-1 text-sm font-medium text-red-800">{error}</p>}
    </div>
  );
}

export function Field(props: BaseFieldProps & { type?: "text" | "email" | "date" | "password" | "tel" | "number"; autoComplete?: string }) {
  const { name, type = "text", required, defaultValue, hint, autoComplete } = props;
  const { error, value, nonce } = useFieldState(name, defaultValue);
  const id = useId();
  return (
    <FieldFrame {...props} id={id} error={error}>
      <input
        key={nonce}
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        defaultValue={type === "password" ? undefined : value}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={inputClass}
      />
    </FieldFrame>
  );
}

export function TextAreaField(props: BaseFieldProps & { rows?: number }) {
  const { name, required, defaultValue, hint, rows = 3 } = props;
  const { error, value, nonce } = useFieldState(name, defaultValue);
  const id = useId();
  return (
    <FieldFrame {...props} id={id} error={error}>
      <textarea
        key={nonce}
        id={id}
        name={name}
        rows={rows}
        required={required}
        defaultValue={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={inputClass}
      />
    </FieldFrame>
  );
}

export function SelectField(props: BaseFieldProps & { options: { value: string; label: string }[]; placeholder?: string }) {
  const { name, required, defaultValue, hint, options, placeholder } = props;
  const { error, value, nonce } = useFieldState(name, defaultValue);
  const id = useId();
  return (
    <FieldFrame {...props} id={id} error={error}>
      <select
        key={nonce}
        id={id}
        name={name}
        required={required}
        defaultValue={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={inputClass}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </FieldFrame>
  );
}

export function useFormState(): ActionState {
  return useContext(FormStateContext);
}

export function FormSuccess({ children }: { children: ReactNode }) {
  const state = useContext(FormStateContext);
  if (!state.ok) return null;
  return <p role="status" className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">{children}</p>;
}
