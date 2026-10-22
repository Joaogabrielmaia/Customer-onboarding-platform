import { z } from "zod";
import { parseCivil } from "@/domain/dates";
import { ValidationError } from "@/domain/errors";
import { MIN_PASSWORD_LENGTH } from "./password";

// Toda entrada passa por aqui antes de tocar no banco (RNF-04).
// Os serviços chamam `parseInput`; não confio que a interface já validou.

const requiredText = (label: string, max = 120) =>
  z.string().trim().min(1, `Informe ${label}.`).max(max, `${label} deve ter no máximo ${max} caracteres.`);

/** Texto opcional: string vazia vira undefined. */
const optionalText = (max = 200) =>
  z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().trim().max(max, `Use no máximo ${max} caracteres.`).optional(),
  );

const civilDateString = z.string().refine(
  (value) => {
    try {
      parseCivil(value);
      return true;
    } catch {
      return false;
    }
  },
  { message: "Informe uma data válida." },
);

const email = z.string().trim().toLowerCase().pipe(z.email("Informe um e-mail válido."));

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Informe a senha."),
});

export const userCreateSchema = z.object({
  name: requiredText("o nome", 100),
  email,
  role: z.enum(["ADMIN", "IMPLEMENTER"], { message: "Escolha o papel." }),
  password: z.string().min(MIN_PASSWORD_LENGTH, `A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`),
});

export const passwordResetSchema = z.object({
  userId: z.string().min(1),
  password: z.string().min(MIN_PASSWORD_LENGTH, `A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`),
});

export const clientSchema = z.object({
  companyName: requiredText("o nome da empresa"),
  cnpj: optionalText(18),
  contactName: requiredText("o nome do contato"),
  contactEmail: email,
  contactPhone: optionalText(20),
  plan: z.enum(["ESSENTIAL", "PROFESSIONAL", "NETWORK"], { message: "Escolha o plano." }),
  contractDate: civilDateString,
});

export const templateSchema = z.object({
  name: requiredText("o nome do modelo"),
  description: optionalText(300),
  stages: z
    .array(
      z.object({
        name: requiredText("o nome da etapa"),
        tasks: z
          .array(
            z.object({
              title: requiredText("o título da tarefa"),
              description: optionalText(300),
              offsetDays: z
                .number({ message: "Informe o prazo em dias." })
                .int("O prazo deve ser um número inteiro de dias.")
                .min(0, "O prazo não pode ser negativo.")
                .max(365, "O prazo máximo é 365 dias."),
              assigneeKind: z.enum(["IMPLEMENTER", "CLIENT", "ADMIN"]),
              required: z.boolean(),
              visibleToClient: z.boolean(),
            }),
          )
          .min(1, "Cada etapa precisa de ao menos uma tarefa."),
      }),
    )
    .min(1, "O modelo precisa de ao menos uma etapa."),
});

export const deploymentCreateSchema = z.object({
  clientId: z.string().min(1, "Escolha o cliente."),
  templateId: z.string().min(1, "Escolha o modelo."),
  implementerId: z.string().min(1, "Escolha o implantador."),
  kickoffDate: civilDateString,
});

export const taskStatusSchema = z.object({
  taskId: z.string().min(1),
  status: z.enum(["PENDING", "IN_PROGRESS", "WAITING_CLIENT", "DONE", "NOT_APPLICABLE"]),
});

export const taskScheduleSchema = z.object({
  taskId: z.string().min(1),
  dueDate: civilDateString.optional(),
  assigneeId: z.string().min(1).optional(),
  reason: optionalText(300),
});

export const commentSchema = z.object({
  taskId: z.string().min(1),
  body: z.string().trim().min(1, "Escreva o comentário.").max(2000, "Use no máximo 2000 caracteres."),
});

export const settingsSchema = z.object({
  overdueToleranceDays: z.number().int().min(0, "Use 0 ou mais dias.").max(30, "O máximo é 30 dias."),
  portalLinkDays: z.number().int().min(1, "Use ao menos 1 dia.").max(365, "O máximo é 365 dias."),
});

export type ClientInput = z.infer<typeof clientSchema>;
export type TemplateInput = z.infer<typeof templateSchema>;

/** Valida `data` com o schema; em caso de erro lança ValidationError com a mensagem de cada campo. */
export function parseInput<T extends z.ZodType>(schema: T, data: unknown): z.infer<T> {
  const result = schema.safeParse(data);
  if (result.success) return result.data;
  const fieldErrors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = issue.path.join(".") || "_";
    if (!(key in fieldErrors)) fieldErrors[key] = issue.message;
  }
  const first = Object.values(fieldErrors)[0] ?? "Dados inválidos.";
  throw new ValidationError(first, fieldErrors);
}
