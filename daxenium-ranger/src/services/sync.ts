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

  const users =
    await db.users.toArray();

  const payload = {
    device: "RANGER",

    syncedAt:
      new Date().toISOString(),

    stockpiles,
    logs,
    photos,
    auditLogs,
    users,
  };

  const response = await fetch(
    "https://office.daxenium.com/api/sync/push",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",

        "x-api-key":
          "DAXENIUM-RANGER-2026",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {

    const errorText =
      await response.text();

    throw new Error(
      `Sikertelen szinkronizálás (${response.status}) ${errorText}`
    );
  }

  const result =
    await response.json();

  console.log(
    "Szinkron sikeres:",
    result
  );

  return result;
}