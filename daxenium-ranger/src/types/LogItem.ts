export interface LogItem {
  id: string;

  stockpileId: string;

  species: string;

  diameter: number;

  length: number;

  volume: number;

  weight: number;

  quality?: string;

  createdAt: string;
}