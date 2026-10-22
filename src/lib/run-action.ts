import "server-only";
import { DomainError, ForbiddenError, ValidationError } from "@/domain/errors";
import { logEvent } from "@/server/log";
import type { ActionState } from "./action-state";

export function formValues(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string" && !key.startsWith("$ACTION")) values[key] = value;
  }
  return values;
}

export async function attempt(
  work: () => Promise<unknown>,
  values?: Record<string, string>,
): Promise<ActionState | undefined> {
  try {
    await work();
    return undefined;
  } catch (error) {
    if (error instanceof ValidationError) {
      return { error: error.message, fieldErrors: error.fieldErrors, values, nonce: Date.now() };
    }
    if (error instanceof ForbiddenError) {
      logEvent("warn", "access_denied");
      return { error: error.message, values, nonce: Date.now() };
    }
    if (error instanceof DomainError) {
      return { error: error.message, values, nonce: Date.now() };
    }
    logEvent("error", "unexpected_error", { name: error instanceof Error ? error.name : "unknown" });
    console.error(error);
    return { error: "Algo deu errado. Tente novamente em instantes.", values, nonce: Date.now() };
  }
}
