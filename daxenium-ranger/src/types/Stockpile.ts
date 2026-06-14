export interface Stockpile {
  id: string;

  gpsLat: number;
  gpsLon: number;

  createdAt: string;
  status: string;

  species?: string;

  estimatedVolume?: number;
  estimatedWeight?: number;

  transportNoteNumber?: string;

  modifiedAt?: string;
  modifiedBy?: string;
}