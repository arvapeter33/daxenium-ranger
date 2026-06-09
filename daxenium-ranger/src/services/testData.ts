import { db } from "../database/db";

export async function createTestLog(
  stockpileId: string
) {
  await db.logEntries.add({
    stockpileId,

    species: "Tölgy",

    length: 4.2,
    diameter: 32,

    volume: 0.338,

    createdAt: new Date().toISOString(),
  });
}