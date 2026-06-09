import { useEffect, useState } from "react";
import { db } from "../database/db";

interface Props {
  onNew: () => void;
  onList: () => void;
}

export default function DashboardPage({
  onNew,
  onList,
}: Props) {

  const [stockpileCount,
    setStockpileCount] =
    useState(0);

  const [logCount,
    setLogCount] =
    useState(0);

  const [totalVolume,
    setTotalVolume] =
    useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {

    const stockpiles =
      await db.stockpiles.count();

    const logs =
      await db.logEntries.toArray();

    setStockpileCount(
      stockpiles
    );

    setLogCount(
      logs.length
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

  return (

    <div>

      <div className="ranger-header">

        <div className="ranger-title">
          DAXENIUM
        </div>

        <div className="ranger-subtitle">
          TIMBERTRACK RANGER
        </div>

        <div className="user-panel">

  <div
    style={{
      background:
        "rgba(0,0,0,0.25)",
      border:
        "1px solid rgba(0,216,255,.3)",
      borderRadius: "12px",
      padding: "10px",
      minWidth: "180px",
    }}
  >

    <div
      style={{
        color: "#00d8ff",
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: "8px",
      }}
    >
      👤 {
        localStorage.getItem(
          "currentUser"
        )
      }
    </div>

    <button
      className="dashboard-blue"
      style={{
        width: "100%",
        height: "40px",
        fontSize: "14px",
      }}
      onClick={() => {

        localStorage.removeItem(
          "currentUser"
        );

        window.location.reload();

      }}
    >
      🚪 Kijelentkezés
    </button>

  </div>

</div>

        <div className="gps-status">
          📍 GPS AKTÍV
        </div>

      </div>

      <div className="stats-grid">

        <div className="stat-card">
          <h3>Rakatok</h3>
          <div className="stat-value">
            {stockpileCount}
          </div>
        </div>

        <div className="stat-card">
          <h3>Rönkök</h3>
          <div className="stat-value">
            {logCount}
          </div>
        </div>

        <div className="stat-card">
          <h3>Készlet</h3>
          <div className="stat-value">
            {totalVolume} m³
          </div>
        </div>

        <div className="stat-card">
          <h3>Offline</h3>
          <div className="stat-value">
            ✔
          </div>
        </div>

      </div>

      <div className="dashboard-grid">

        <button
          className="
            dashboard-btn
            dashboard-green
          "
          onClick={onNew}
        >
          🌲
          <br />
          ÚJ RAKAT
        </button>

        <button
          className="
            dashboard-btn
            dashboard-blue
          "
          onClick={onList}
        >
          📦
          <br />
          RAKATOK
        </button>

        <button
          className="
            dashboard-btn
            dashboard-dark
          "
        >
          ☁️
          <br />
          SZINKRONIZÁLÁS
        </button>

      </div>

      <div className="card">

        <h2>
          Ranger állapot
        </h2>

        <p>
          GPS: Aktív
        </p>

        <p>
          Offline mód: Aktív
        </p>

        <p>
          Adatbázis: Elérhető
        </p>

      </div>

      <div className="card">

        <h2>
          EUDR kompatibilis
        </h2>

        <p>✔ GPS helyzet</p>

        <p>✔ Időbélyeg</p>

        <p>✔ Rakat azonosító</p>

        <p>✔ Offline működés</p>

      </div>

    </div>
  );
}