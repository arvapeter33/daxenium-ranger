import { jsPDF } from "jspdf";
import { useState } from "react";
import QRCode from "qrcode";

interface Props {
  stockpileId: string;
}

export default function LabelPrintPage({
  stockpileId,
}: Props) {

  const [widthMm, setWidthMm] =
    useState(100);

  const [heightMm, setHeightMm] =
    useState(50);

  const createPdf = async () => {

    const pdf =
      new jsPDF({
        orientation:
          widthMm > heightMm
            ? "landscape"
            : "portrait",
        unit: "mm",
        format: [
          widthMm,
          heightMm,
        ],
      });

    const qrImage =
      await QRCode.toDataURL(
        stockpileId
      );

    const topMargin = 15;

const qrSize =
  Math.min(
    widthMm * 0.8,
    heightMm - topMargin - 5
  );

const qrX =
  (widthMm - qrSize) / 2;

const qrY =
  topMargin;

pdf.setFontSize(18);

const textWidth =
  pdf.getTextWidth(
    stockpileId
  );

pdf.text(
  stockpileId,
  (widthMm - textWidth) / 2,
  10
);

pdf.addImage(
  qrImage,
  "PNG",
  qrX,
  qrY,
  qrSize,
  qrSize
);

    pdf.save(
      `${stockpileId}.pdf`
    );
  };

  return (
    <div className="card">

      <h1>
        🖨 QR címke
      </h1>

      <label>
        Szélesség (mm)
      </label>

      <input
        type="number"
        value={widthMm}
        onChange={(e) =>
          setWidthMm(
            Number(e.target.value)
          )
        }
      />

      <label>
        Magasság (mm)
      </label>

      <input
        type="number"
        value={heightMm}
        onChange={(e) =>
          setHeightMm(
            Number(e.target.value)
          )
        }
      />

      <button
        className="dashboard-green"
        onClick={createPdf}
      >
        🖨 PDF generálás
      </button>

    </div>
  );
}