import { useState } from "react";
import DashboardPage from "./pages/DashboardPage";
import NewStockpilePage from "./pages/NewStockpilePage";
import StockpileListPage from "./pages/StockpileListPage";
import StockpileDetailsPage from "./pages/StockpileDetailsPage";
import AddLogPage from "./pages/AddLogPage";
import { db } from "./database/db";
import "./App.css";
import QrScannerPage
from "./pages/QrScannerPage";
import LabelPrintPage
from "./pages/LabelPrintPage";
import AIKobozesPage
from "./pages/AIKobozesPage";
import LoginPage
from "./pages/LoginPage";

type Page =
  | "dashboard"
  | "new"
  | "list"
  | "stockpile"
  | "addlog"
  | "qrscan"
  | "labelprint"
  | "aicalc";

function App() {

  const [loggedIn, setLoggedIn] =
  useState(
    !!localStorage.getItem(
      "currentUser"
    )
  );

  const [page, setPage] =
    useState<Page>("dashboard");

  const [
    selectedStockpileId,
    setSelectedStockpileId,
  ] = useState<string | null>(null);

  const deleteStockpile = async () => {

    if (!selectedStockpileId) {
      return;
    }

    const confirmed = confirm(
      "Biztosan törlöd a rakatot és az összes rönköt?"
    );

    if (!confirmed) {
      return;
    }

    await db.stockpiles.delete(
      selectedStockpileId
    );

    await db.logEntries
      .where("stockpileId")
      .equals(selectedStockpileId)
      .delete();

    setSelectedStockpileId(null);

    setPage("list");
  };

  if (!loggedIn) {

  return (

    <LoginPage
      onLogin={() =>
        setLoggedIn(true)
      }
    />

  );

}

  switch (page) {

    case "new":

      return (
        <div>

          <button
            className="back-btn"
            onClick={() =>
              setPage("dashboard")
            }
          >
            ⬅ VISSZA
          </button>

          <NewStockpilePage

  onCreated={(id) => {

    setSelectedStockpileId(id);

    setPage("stockpile");

  }}

/>

        </div>
      );

    case "list":

      return (
        <div>

          <button
            className="back-btn"
            onClick={() =>
              setPage("dashboard")
            }
          >
            ⬅ VISSZA
          </button>

          <StockpileListPage
            onOpen={(id) => {

              setSelectedStockpileId(id);

              setPage("stockpile");

            }}

                onQrScan={() =>
                setPage("qrscan")
              }
          />

        </div>
      );

    case "stockpile":

      if (!selectedStockpileId) {
        return (
          <div>
            Nincs kiválasztott rakat
          </div>
        );
      }

      return (
        <div>

          <button
            className="back-btn"
            onClick={() =>
              setPage("list")
            }
          >
            ⬅ VISSZA
          </button>

          <StockpileDetailsPage
            stockpileId={
              selectedStockpileId
            }
            onAddLog={() =>
              setPage("addlog")
            }
            onDelete={
              deleteStockpile
            }
            onPrint={() =>
              setPage("labelprint")
            }
            onAiCalc={() =>
              setPage("aicalc")
            }
          />

        </div>
      );

    case "addlog":

      if (!selectedStockpileId) {
        return (
          <div>
            Nincs kiválasztott rakat
          </div>
        );
      }

      return (
        <div>

          <button
            className="back-btn"
            onClick={() =>
              setPage("stockpile")
            }
          >
            ⬅ VISSZA
          </button>

          <AddLogPage
            stockpileId={
              selectedStockpileId
            }
          />

        </div>
      );

    case "dashboard":
    default:

      return (
        <DashboardPage
          onNew={() =>
            setPage("new")
          }
          onList={() =>
            setPage("list")
          }
        />
      );

      case "qrscan":

  return (

    <div>

      <button
        className="back-btn"
        onClick={() =>
          setPage("list")
        }
      >
        ⬅ VISSZA
      </button>

      <QrScannerPage

        onScan={(id) => {

          setSelectedStockpileId(id);

          setPage("stockpile");

        }}

      />

    </div>

  );

  case "labelprint":

  if (!selectedStockpileId) {
    return (
      <div>
        Nincs kiválasztott rakat
      </div>
    );
  }

  return (
    <div>

      <button
        className="back-btn"
        onClick={() =>
          setPage("stockpile")
        }
      >
        ← VISSZA
      </button>

      <LabelPrintPage
        stockpileId={
          selectedStockpileId
        }
      />

    </div>
  );

  case "aicalc":

  if (!selectedStockpileId) {

    return (
      <div>
        Nincs kiválasztott rakat
      </div>
    );
  }

  return (

    <div>

      <button
        className="back-btn"
        onClick={() =>
          setPage("stockpile")
        }
      >
        ⬅ VISSZA
      </button>

      <AIKobozesPage
        stockpileId={
          selectedStockpileId
        }
      />

    </div>

  );
  }


}

export default App;