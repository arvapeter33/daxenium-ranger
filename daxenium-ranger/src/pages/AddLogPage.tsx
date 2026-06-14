import { useState } from "react";
import { db } from "../database/db";
import {
  writeAuditLog
} from "../services/auditLogService";

import {
  calculateVolume as calculateTimberVolume
} from "../services/cubingService";

interface Props {
  stockpileId: string;
}

export default function AddLogPage({
  stockpileId,
}: Props) {

  const [species, setSpecies] =
    useState("Tölgy");

  const [length, setLength] =
    useState("");

  const [diameter, setDiameter] =
    useState("");

  const [quantity, setQuantity] =
    useState("1");

    const [assortmentType, setAssortmentType] =
  useState("Fűrészrönk");

  const getCalculatedVolume = () => {

    const d = Number(diameter);
    const l = Number(length);
    const q = Number(quantity);

    if (!d || !l || !q) {
      return 0;
    }

    return calculateTimberVolume(
  d,
  l,
  q,
  species,
  assortmentType
);
  }
  
  const saveLog = async () => {

    const d = Number(diameter);
    const l = Number(length);
    const q = Number(quantity);

    const volume =
  calculateTimberVolume(
    d,
    l,
    q,
    species,
    assortmentType
  );

    if (!d || !l || !q) {

      alert(
        "Tölts ki minden mezőt!"
      );

      return;
    }

    await db.logEntries.add({

  stockpileId,

  species,

  assortmentType,

  length: l,

  diameter: d,

  quantity: q,

  volume,

  createdAt:
    new Date().toISOString(),

});

    await writeAuditLog(
      `Rönk hozzáadva (${q} db ${species})`,
      stockpileId
    );

    alert(
      "Rönk mentve!"
    );

    setLength("");
    setDiameter("");
    setQuantity("1");
  };

  return (

    <div>

      <h1>
        🌳 Új rönk
      </h1>

      <div className="card">

        <h3>
          Rakat azonosító
        </h3>

        <p>
          {stockpileId}
        </p>

      </div>

      <div className="card">

        <h3>
          Fafaj
        </h3>

        <select
          value={species}
          onChange={(e) =>
            setSpecies(
              e.target.value
            )
          }
        >
          <option>Tölgy</option>
          <option>Akác</option>
          <option>Bükk</option>
          <option>Nyár</option>
          <option>Lucfenyő</option>
          <option>Erdeifenyő</option>
        </select>

      </div>

      <div className="card">

  <h3>
    Választék típusa
  </h3>

  <select
    value={assortmentType}
    onChange={(e) =>
      setAssortmentType(
        e.target.value
      )
    }
  >

    <option>
      Fűrészrönk
    </option>

    <option>
      Papírfa
    </option>

    <option>
      Tűzifa
    </option>

    <option>
      Oszlopfa
    </option>

    <option>
      Állófa becslés
    </option>

  </select>

</div>

      <div className="card">

        <h3>
          Hossz (m)
        </h3>

        <input
          type="number"
          step="0.1"
          value={length}
          onChange={(e) =>
            setLength(
              e.target.value
            )
          }
        />

      </div>

      <div className="card">

        <h3>
          Átmérő (cm)
        </h3>

        <input
          type="number"
          value={diameter}
          onChange={(e) =>
            setDiameter(
              e.target.value
            )
          }
        />

      </div>

      <div className="card">

        <h3>
          Darabszám
        </h3>

        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) =>
            setQuantity(
              e.target.value
            )
          }
        />

      </div>

      <div className="card">

        <h3>
          Számított térfogat
        </h3>

        <div
          style={{
            fontSize: "36px",
            fontWeight: "bold",
            color: "#65b32e",
            textAlign: "center",
          }}
        >
          {getCalculatedVolume()} m³
        </div>

      </div>

      <button
        className="
          dashboard-btn
          dashboard-green
        "
        onClick={saveLog}
      >
        💾 Rönk mentése
      </button>

    </div>

  );
}