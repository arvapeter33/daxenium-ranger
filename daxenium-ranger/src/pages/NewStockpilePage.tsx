import { useState } from "react";
import { db } from "../database/db";
import { getCurrentLocation } from "../services/gps";
import { generateStockpileId } from "../services/idGenerator";
import {
  writeAuditLog
} from "../services/auditLogService";

interface Props {
  onCreated: (
    stockpileId: string
  ) => void;
}

export default function NewStockpilePage({
  onCreated,
}: Props) {
  const [loading, setLoading] = useState(false);

  const createStockpile = async () => {
    setLoading(true);

    try {
      const location = await getCurrentLocation();
      const id = generateStockpileId();

      await db.stockpiles.add({
        id,
        gpsLat:
          location.coords.latitude,
        gpsLon:
          location.coords.longitude,
          species: "",

          estimatedVolume: undefined,

          estimatedWeight: undefined,
          
        createdAt:
          new Date().toISOString(),
        status: "Új rakat",
      });

      await writeAuditLog(
  "Új rakat létrehozva",
  id
);

      onCreated(id);
    } catch (err) {
      alert("GPS hiba");
    }

    setLoading(false);
  };

  return (

  <div className="page-container">

    <div className="card">

      <h1>
        🌲 Új rakat
      </h1>

      <p
        style={{
          textAlign: "center",
          color: "#9aa8b8",
          marginBottom: "30px",
        }}
      >
        GPS pozíció alapján új
        fakitermelési rakat létrehozása.
      </p>

      <button
        className="new-stockpile-btn"
        onClick={createStockpile}
        disabled={loading}
      >
        {loading
          ? "⏳ LÉTREHOZÁS..."
          : "🌲 ÚJ RAKAT INDÍTÁSA"}
      </button>

    </div>

  </div>
);
}