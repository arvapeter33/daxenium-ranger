import { db } from "../database/db";

export async function
writeAuditLog(

  action: string,

  stockpileId?: string

) {

  const username =
    localStorage.getItem(
      "currentUser"
    ) || "ismeretlen";

  await db.auditLogs.add({

    username,

    action,

    stockpileId,

    createdAt:
      new Date().toISOString(),

  });

}