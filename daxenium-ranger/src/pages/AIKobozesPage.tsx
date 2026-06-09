import { useEffect, useState } from "react";
import cv from "@techstark/opencv-js";

interface Props {
  stockpileId: string;
}

export default function AIKobozesPage({
  stockpileId,
}: Props) {

  const [length, setLength] =
    useState("");

  const [width, setWidth] =
    useState("");

  const [image, setImage] =
    useState<File | null>(null);

  const [previewUrl,
    setPreviewUrl] =
    useState("");

  const [estimatedLogs,
    setEstimatedLogs] =
    useState<number | null>(null);

  const [estimatedVolume,
    setEstimatedVolume] =
    useState<number | null>(null);

  const [averageDiameter,
    setAverageDiameter] =
    useState<number | null>(null);

  const [imageWidth,
    setImageWidth] =
    useState<number | null>(null);

  const [imageHeight,
    setImageHeight] =
    useState<number | null>(null);

    const [grayImage,
  setGrayImage] =
  useState("");

  const [opencvReady,
    setOpencvReady] =
    useState(false);

  useEffect(() => {

    if (cv) {

      setOpencvReady(true);

    }

  }, []);

  const startAnalysis = () => {

  if (!image) {

    alert(
      "Válassz ki egy képet!"
    );

    return;
  }

  const l =
    Number(length);

  const w =
    Number(width);

  if (!l || !w) {

    alert(
      "Add meg a rakat méreteit!"
    );

    return;
  }

  try {

    const img =
      document.getElementById(
        "preview-image"
      ) as HTMLImageElement;

    if (!img) {

      alert(
        "A kép nem található!"
      );

      return;
    }

    const canvas =
      document.createElement(
        "canvas"
      );

    canvas.width =
      img.naturalWidth;

    canvas.height =
      img.naturalHeight;

    const ctx =
      canvas.getContext("2d");

    if (!ctx) {

      alert(
        "Canvas hiba!"
      );

      return;
    }

    ctx.drawImage(
      img,
      0,
      0
    );

    console.log("1");

const src =
  cv.imread(canvas);

console.log("2");

const gray =
  new cv.Mat();

console.log("3");

cv.cvtColor(
  src,
  gray,
  cv.COLOR_RGBA2GRAY
);

console.log("4");

cv.GaussianBlur(
  gray,
  gray,
  new cv.Size(5, 5),
  0
);

const circles =
  new cv.Mat();

cv.HoughCircles(
  gray,
  circles,
  cv.HOUGH_GRADIENT,
  1.5,
  30,
  120,
  35,
  10,
  35
);

console.log(
  "Talált körök:",
  circles.cols
);

setEstimatedLogs(
  circles.cols
);

for (
  let i = 0;
  i < circles.cols;
  i++
) {

  const x =
    circles.data32F[
      i * 3
    ];

  const y =
    circles.data32F[
      i * 3 + 1
    ];

  const radius =
    circles.data32F[
      i * 3 + 2
    ];

  const center =
    new cv.Point(
      x,
      y
    );

  cv.circle(
    src,
    center,
    radius,
    new cv.Scalar(
      0,
      255,
      0,
      255
    ),
    3
  );
}

cv.imshow(
  canvas,
  src
);

setGrayImage(
  canvas.toDataURL(
    "image/png"
  )
);

circles.delete();
/*
src.delete();
gray.delete();
edges.delete();
*/
    setGrayImage(
      canvas.toDataURL(
        "image/png"
      )
    );

    src.delete();
    gray.delete();

  } catch (error) {

  console.error(
    "OpenCV HIBA:",
    error
  );

  alert(
    "OpenCV feldolgozási hiba!"
  );
}
/*
  const estimatedCount =
    Math.round(
      l * w * 5
    );
*/
  const avgDiameter =
    30;

  const volume =
    Number(
      (
        l *
        w *
        0.75
      ).toFixed(2)
    );
/*
  setEstimatedLogs(
    estimatedCount
  );
*/

  setAverageDiameter(
    avgDiameter
  );

  setEstimatedVolume(
    volume
  );
};

  return (

    <div className="card">

      <h1>
        📷 AI Fa hozzáadás
      </h1>

      <p>
        OpenCV:
        {" "}
        <strong>
          {opencvReady
            ? "✅ Betöltve"
            : "❌ Nem elérhető"}
        </strong>
      </p>

      <p>
        Rakat:
        <br />
        {stockpileId}
      </p>

      <label>
        Rakat hossz (m)
      </label>

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

      <label>
        Rakat szélesség (m)
      </label>

      <input
        type="number"
        step="0.1"
        value={width}
        onChange={(e) =>
          setWidth(
            e.target.value
          )
        }
      />

      <label>
        Fotó
      </label>

      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => {

          if (
            e.target.files &&
            e.target.files[0]
          ) {

            const file =
              e.target.files[0];

            setImage(file);

            const url =
              URL.createObjectURL(
                file
              );

            setPreviewUrl(url);

            const img =
              new Image();

            img.onload = () => {

              setImageWidth(
                img.width
              );

              setImageHeight(
                img.height
              );

            };

            img.src = url;

          }

        }}
      />

      {previewUrl && (

        <div
          style={{
            marginTop: "20px",
            textAlign: "center",
          }}
        >

          <img
  id="preview-image"
  src={previewUrl}
  alt="Rakat fotó"
  style={{
    width: "100%",
    maxWidth: "600px",
    borderRadius: "12px",
    border:
      "1px solid rgba(0,216,255,.3)",
  }}
/>

        </div>

      )}

      {imageWidth &&
        imageHeight && (

        <div
          className="card"
          style={{
            marginTop: "15px",
          }}
        >

          <p>
            Kép méret:
            {" "}
            <strong>
              {imageWidth}
              {" × "}
              {imageHeight}
            </strong>
          </p>

        </div>

      )}

      <br />
      <br />

      <button
        className="dashboard-green"
        onClick={startAnalysis}
      >
        🤖 Köbözés indítása
      </button>

      {grayImage && (

  <div
    className="card"
    style={{
      marginTop: "20px",
    }}
  >

    <h2>
      OpenCV eredmény
    </h2>

    <img
      src={grayImage}
      alt="OpenCV"
      style={{
        width: "100%",
        maxWidth: "600px",
        borderRadius: "12px",
      }}
    />

  </div>

)}

      {estimatedLogs !== null && (

        <div
          className="card"
          style={{
            marginTop: "20px",
          }}
        >

          <h2>
            🤖 AI Becslés
          </h2>

          <p>
            Kép szélesség:
            {" "}
            <strong>
              {imageWidth} px
            </strong>
          </p>

          <p>
            Kép magasság:
            {" "}
            <strong>
              {imageHeight} px
            </strong>
          </p>

          <p>
            Rönkök:
            {" "}
            <strong>
              {estimatedLogs} db
            </strong>
          </p>

          <p>
            Átlag átmérő:
            {" "}
            <strong>
              {averageDiameter} cm
            </strong>
          </p>

          <p>
            Becsült térfogat:
            {" "}
            <strong>
              {estimatedVolume} m³
            </strong>
          </p>

        </div>

      )}

    </div>
  );
}