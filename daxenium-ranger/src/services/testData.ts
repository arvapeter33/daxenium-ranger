import { db } from "../database/db";

export async function createTestLog(
  stockpileId: string
) {
  await db.logEntries.add({
  stockpileId: "TT-001",
  species: "Tölgy",
  length: 4,
  diameter: 30,
  quantity: 1,
  volume: 0.282,
  createdAt: new Date().toISOString(),
});
}