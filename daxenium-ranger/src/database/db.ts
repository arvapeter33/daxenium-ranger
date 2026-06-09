import Dexie from "dexie";

import type { Stockpile } from "../types/Stockpile";
import type { LogEntry } from "../types/LogEntry";

class RangerDB extends Dexie {
  stockpiles!: Dexie.Table<Stockpile, string>;

  logEntries!: Dexie.Table<LogEntry, number>;

  photos!: Dexie.Table<{
  id?: number;
  stockpileId: string;
  image: string;
  createdAt: string;
  createdBy: string;
}, number>;

auditLogs!: Dexie.Table<
  {
    id?: number;
    username: string;
    action: string;
    stockpileId?: string;
    createdAt: string;
  },
  number
>;

users!: Dexie.Table<
  {
    id: string;
    username: string;
    passwordHash: string;
    isActive: boolean;
    lastSync: string;
  },
  string
>;

  constructor() {
    super("DaxeniumRangerDB");

    this.version(2).stores({
      stockpiles: "id,createdAt,status",

      logEntries:
        "++id,stockpileId,species,createdAt",
    });

    this.version(5).stores({

  stockpiles:
    "id,createdAt,status",

  logEntries:
    "++id,stockpileId,species,createdAt",

  photos:
    "++id,stockpileId,createdAt",

  auditLogs:
    "++id,username,stockpileId,createdAt",

  users:
    "id,username,isActive,lastSync",

});
  }
}

export const db = new RangerDB();