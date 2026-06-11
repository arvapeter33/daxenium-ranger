import { db } from "../database/db";

export async function syncNow() {
  const stockpiles =
    await db.stockpiles.toArray();

  const logs =
    await db.logEntries.toArray();

  const photos =
    await db.photos.toArray();

  const auditLogs =
    await db.auditLogs.toArray();

  const response = await fetch(
    "https://office.daxenium.hu/api/sync/push",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key":
          "DAXENIUM-RANGER-2026",
      },
      body: JSON.stringify({
        stockpiles,
        logs,
        photos,
        auditLogs,
        syncedAt:
          new Date().toISOString(),
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Sikertelen szinkronizálás"
    );
  }

  return true;
}