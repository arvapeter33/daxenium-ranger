import { useEffect, useState } from "react";
import { db } from "../database/db";
import type { Stockpile } from "../types/Stockpile";

interface Props {
  onOpen: (id: string) => void
  onQrScan: () => void;
}

export default function StockpileListPage({
  onOpen,
  onQrScan,
}: Props) {

  const [items, setItems] =
    useState<Stockpile[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {

    const data =
      await db.stockpiles.toArray();

    setItems(data);
  };

  const getStatusColor = (
  status: string
) => {

  switch (status) {

    case "Új rakat":
      return "#22c55e";

    case "Kitermelve":
      return "#eab308";

    case "Szállítás alatt":
      return "#f97316";

    case "Telephelyen":
      return "#0ea5e9";

    case "Feldolgozás alatt":
      return "#a855f7";

    case "Lezárva":
      return "#6b7280";

    case "ACTIVE":
      return "#22c55e";

    default:
      return "#00d8ff";
  }
};

  return (

    <div>

      <div className="list-header">

  <h1 className="page-title">
  📦 Rakatok
</h1>

  <button
  className="scan-qr-btn"
  onClick={onQrScan}
>
  📷 QR beolvasás
</button>

</div>

      {items.length === 0 && (

        <div className="card">

          <h3>Nincs rakat</h3>

          <p>
            Hozz létre egy új rakatot.
          </p>

        </div>

      )}

      {items.map((item) => (

        <div
          key={item.id}
          className="stockpile-card"
          onClick={() =>
            onOpen(item.id)
          }
        >

          <div className="stockpile-id">
            {item.id}
          </div>

          <div className="stockpile-meta">

            🌍 GPS

            <br />

            {item.gpsLat.toFixed(6)}
            {" , "}
            {item.gpsLon.toFixed(6)}

          </div>

          <div
            className="stockpile-meta"
            style={{
              marginTop: "10px",
            }}
          >

            📅 {item.createdAt}

          </div>

          <div
  style={{
    marginTop: "12px",
    display: "inline-block",
    padding: "6px 14px",
    borderRadius: "999px",
    background:
      getStatusColor(
        item.status
      ),
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: "14px",
  }}
>
  {item.status}
</div>

        </div>

      ))}

    </div>
  );
}