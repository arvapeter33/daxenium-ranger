import { useEffect, useState } from "react";
import { db } from "../database/db";
import type { Stockpile } from "../types/Stockpile";
import { QRCodeCanvas } from "qrcode.react";
import StockpilePhotos
from "../components/StockpilePhotos";
import {
  writeAuditLog
} from "../services/auditLogService";

interface Props {
  stockpileId: string;
  onAddLog: () => void;
  onDelete: () => void;
  onPrint: () => void;
  onAiCalc: () => void;
}

export default function StockpileDetailsPage({
  stockpileId,
  onAddLog,
  onDelete,
  onPrint,
onAiCalc,
}: Props) {
  const [stockpile, setStockpile] =
    useState<Stockpile | null>(null);

    const [logCount, setLogCount] =
  useState(0);

const [totalVolume, setTotalVolume] =
  useState(0);

const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
  loadStockpile();
  loadLogs();
}, []);

const loadLogs = async () => {

  const logs =
    await db.logEntries
      .where("stockpileId")
      .equals(stockpileId)
      .toArray();

  setLogs(logs);

  const totalLogs =
  logs.reduce(
    (sum, log) =>
      sum +
      (log.quantity || 1),
    0
  );

setLogCount(
  totalLogs
);

  const volume =
    logs.reduce(
      (sum, log) =>
        sum + log.volume,
      0
    );

  setTotalVolume(
    Number(volume.toFixed(3))
  );
};

const deleteLog = async (
  logId: number
) => {

  const confirmed =
    confirm(
      "Biztosan törlöd ezt a rönköt?"
    );

  if (!confirmed) {
    return;
  }

  await db.logEntries.delete(logId);

  await writeAuditLog(
  "Rönk törölve",
  stockpileId
);

  await loadLogs();
};

  const loadStockpile = async () => {
    const data =
      await db.stockpiles.get(stockpileId);

    if (data) {
      setStockpile(data);
    }
  };

  if (!stockpile) {
    return <div>Betöltés...</div>;
  }

return (
  <div>

    <h1>🌲 Rakat részletek</h1>

    <div className="details-card">

  <h2>{stockpile.id}</h2>

  <p>
    🌍 GPS:
    <br />
    {stockpile.gpsLat},
    {stockpile.gpsLon}
  </p>

  <p>
    📅 Létrehozva:
    <br />
    {stockpile.createdAt}
  </p>

  <div
  className="card"
  style={{
    marginTop: "15px",
    marginBottom: "15px",
  }}
>

  <h3>
    📌 Rakat állapota
  </h3>

  <select
    value={stockpile.status}
    onChange={async (e) => {

      const newStatus =
        e.target.value;

      await db.stockpiles.update(
        stockpile.id,
        {
          status: newStatus,
        }
      );

      await writeAuditLog(
  `Állapot módosítva: ${newStatus}`,
  stockpile.id
);

      setStockpile({
        ...stockpile,
        status: newStatus,
      });

    }}
    style={{
      width: "100%",
      height: "50px",
      fontSize: "16px",
    }}
  >

    <option value="Új rakat">
      🟢 Új rakat
    </option>

    <option value="Kitermelve">
      🟡 Kitermelve
    </option>

    <option value="Szállítás alatt">
      🟠 Szállítás alatt
    </option>

    <option value="Telephelyen">
      🔵 Telephelyen
    </option>

    <option value="Feldolgozás alatt">
      🟣 Feldolgozás alatt
    </option>

    <option value="Lezárva">
      ⚫ Lezárva
    </option>

  </select>

</div>

  <button
    className="delete-stockpile-btn"
    onClick={onDelete}
  >
    🗑️ Rakat törlése
  </button>

  <div
  style={{
    marginTop: "25px",
    display: "flex",
    justifyContent: "center",
  }}
>
  <div
    style={{
      background: "#ffffff",
      padding: "12px",
      borderRadius: "12px",
    }}
  >
    <QRCodeCanvas
  value={JSON.stringify({
    id: stockpile.id,
    gpsLat: stockpile.gpsLat,
    gpsLon: stockpile.gpsLon,
  })}
  size={180}
/>
    </div>
  </div>

<p
  style={{
    textAlign: "center",
    marginTop: "10px",
    color: "#00d8ff",
    fontWeight: 700,
  }}
>
  QR azonosító
</p>

<div className="details-actions">
  
  <button
  className="dashboard-blue"
  style={{
    height: "110px",
    fontSize: "20px",
  }}
  onClick={onPrint}
>
  🖨 QR nyomtatás
</button>

  <button
  className="dashboard-green"
  style={{
    height: "110px",
    fontSize: "20px",
  }}
  onClick={onAiCalc}
>
  🤖 AI Fa hozzáadás
</button>

<div
  className="card"
  style={{
    marginTop: "20px",
  }}
>
  <h2>📷 Fotógaléria</h2>

  <StockpilePhotos
    stockpileId={stockpileId}
  />
</div>

</div>

</div>

    <div className="stats-grid">

      <div className="stat-card">

        <h3>Rönkök</h3>

        <div className="value">
          {logCount}
        </div>

      </div>

      <div className="stat-card">

        <h3>Összes m³</h3>

        <div className="value">
          {totalVolume}
        </div>

      </div>

    </div>

    <button
      className="dashboard-btn dashboard-green"
      onClick={onAddLog}
    >
      ➕ Fa hozzáadása
    </button>

    <h2>Rönk lista</h2>

    {logs.length === 0 && (

      <div className="card">

        <p>
          Még nincs rönk
          ebben a rakatban.
        </p>

      </div>

    )}

    {logs.map((log) => (

      <div
        key={log.id}
        className="log-card"
      >

        <strong>
          🌳 {log.species}
        </strong>

        <p>
          Hossz:
          {" "}
          {log.length}
          {" "}m
        </p>

        <p>
          Átmérő:
          {" "}
          {log.diameter}
          {" "}cm
        </p>

        <p>
  Darabszám:
  {" "}
  {log.quantity || 1}
  {" "}db
</p>

        <p>
          Térfogat:
          {" "}
          {log.volume}
          {" "}m³
        </p>

        <button
          style={{
            marginTop: "10px",
            background:
              "#b42318",
            height: "45px",
          }}
          onClick={() =>
            deleteLog(log.id)
          }
        >
          🗑️ Törlés
        </button>

      </div>

    ))}

  </div>
);
}