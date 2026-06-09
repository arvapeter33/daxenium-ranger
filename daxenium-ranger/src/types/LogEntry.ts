export interface LogEntry {
  id?: number;
  stockpileId: string;

  species: string;

  length: number;
  diameter: number;

  quantity: number;
  volume: number;

  createdAt: string;
}