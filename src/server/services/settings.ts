import { assertCan } from "@/domain/permissions";
import type { Actor } from "@/domain/types";
import { recordAudit } from "../audit";
import { db } from "../db";
import { parseInput, settingsSchema } from "../schemas";

export interface AppSettings {
  overdueToleranceDays: number;
  portalLinkDays: number;
}

export async function getSettings(): Promise<AppSettings> {
  const row = await db.setting.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });
  return { overdueToleranceDays: row.overdueToleranceDays, portalLinkDays: row.portalLinkDays };
}

export async function updateSettings(actor: Actor, raw: unknown): Promise<AppSettings> {
  assertCan(actor, "settings:update");
  const input = parseInput(settingsSchema, raw);
  const before = await getSettings();

  await db.$transaction(async (tx) => {
    await tx.setting.update({ where: { id: 1 }, data: input });
    for (const key of ["overdueToleranceDays", "portalLinkDays"] as const) {
      if (before[key] === input[key]) continue;
      await recordAudit(tx, {
        action: "SETTINGS_CHANGED",
        actorId: actor.id,
        field: key,
        oldValue: String(before[key]),
        newValue: String(input[key]),
      });
    }
  });
  return input;
}
