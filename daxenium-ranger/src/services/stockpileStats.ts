import { db } from "../database/db";

export async function getStockpileVolume(
  stockpileId: string
) {
  const logs =
    await db.logEntries
      .where("stockpileId")
      .equals(stockpileId)
      .toArray();

  return logs.reduce(
    (sum, item) => sum + item.volume,
    0
  );
}