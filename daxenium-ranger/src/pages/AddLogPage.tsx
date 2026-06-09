import { useState } from "react";
import { db } from "../database/db";
import {
  writeAuditLog
} from "../services/auditLogService";

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

  const calculateVolume = () => {

    const d = Number(diameter);
    const l = Number(length);
    const q = Number(quantity);

    if (!d || !l || !q) {
      return 0;
    }

    const radius =
      d / 100 / 2;

    const singleVolume =
      Math.PI *
      radius *
      radius *
      l;

    return Number(
      (
        singleVolume * q
      ).toFixed(3)
    );
  };

  const saveLog = async () => {

    const d = Number(diameter);
    const l = Number(length);
    const q = Number(quantity);

    if (!d || !l || !q) {

      alert(
        "Tölts ki minden mezőt!"
      );

      return;
    }

    const radius =
      d / 100 / 2;

    const singleVolume =
      Math.PI *
      radius *
      radius *
      l;

    const volume =
      Number(
        (
          singleVolume * q
        ).toFixed(3)
      );

    await db.logEntries.add({

      stockpileId,

      species,

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
          <option>
            Tölgy
          </option>

          <option>
            Akác
          </option>

          <option>
            Bükk
          </option>

          <option>
            Nyár
          </option>

          <option>
            Lucfenyő
          </option>

          <option>
            Erdeifenyő
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
          {calculateVolume()} m³
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