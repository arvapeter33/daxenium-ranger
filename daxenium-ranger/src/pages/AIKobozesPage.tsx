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

    const [referenceLength,
  setReferenceLength] =
  useState("100");

const [referenceStart,
  setReferenceStart] =
  useState<{
    x: number;
    y: number;
  } | null>(null);

const [referenceEnd,
  setReferenceEnd] =
  useState<{
    x: number;
    y: number;
  } | null>(null);

const [cmPerPixel,
  setCmPerPixel] =
  useState<number | null>(null);

  useEffect(() => {

    if (cv) {

      setOpencvReady(true);

    }

  }, []);

  const handleImageClick = (
  e: React.MouseEvent<
    HTMLImageElement
  >
) => {

  const rect =
    e.currentTarget.getBoundingClientRect();

  const x =
    e.clientX - rect.left;

  const y =
    e.clientY - rect.top;

  if (!referenceStart) {

    setReferenceStart({
      x,
      y,
    });

    return;
  }

  if (!referenceEnd) {

    setReferenceEnd({
      x,
      y,
    });

    const pixelDistance =
      Math.sqrt(
        Math.pow(
          x - referenceStart.x,
          2
        ) +
        Math.pow(
          y - referenceStart.y,
          2
        )
      );

    const scale =
      Number(referenceLength) /
      pixelDistance;

    setCmPerPixel(scale);

    return;
  }

  setReferenceStart({
    x,
    y,
  });

  setReferenceEnd(null);
};

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

  let avgDiameter = 30;
let volume = 0;

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

const clahe = new cv.CLAHE(
  3.0,
  new cv.Size(8, 8)
);

clahe.apply(
  gray,
  gray
);

cv.GaussianBlur(
  gray,
  gray,
  new cv.Size(5, 5),
  0
);

const thresh =
  new cv.Mat();

cv.adaptiveThreshold(
  gray,
  thresh,
  255,
  cv.ADAPTIVE_THRESH_GAUSSIAN_C,
  cv.THRESH_BINARY_INV,
  31,
  5
);

const kernel =
  cv.Mat.ones(
    3,
    3,
    cv.CV_8U
  );

cv.morphologyEx(
  thresh,
  thresh,
  cv.MORPH_OPEN,
  kernel
);

const contours =
  new cv.MatVector();

const hierarchy =
  new cv.Mat();

cv.findContours(
  thresh,
  contours,
  hierarchy,
  cv.RETR_EXTERNAL,
  cv.CHAIN_APPROX_SIMPLE
);

let logCount = 0;

const diameters:number[] = [];

const detectedLogs: {
  x: number;
  y: number;
  r: number;
}[] = [];

for (
  let i = 0;
  i < contours.size();
  i++
) {

  const contour =
    contours.get(i);

  if (
    contour.rows < 5
  ) {
    contour.delete();
    continue;
  }

  const area =
  cv.contourArea(
    contour
  );

if (
  area < 300 ||
  area > 100000
) {
  contour.delete();
  continue;
}

const perimeter =
  cv.arcLength(
    contour,
    true
  );

const circularity =
  (
    4 *
    Math.PI *
    area
  ) /
  (
    perimeter *
    perimeter
  );

if (
  circularity < 0.55
) {
  contour.delete();
  continue;
}

  const ellipse =
    cv.fitEllipse(
      contour
    );

  const widthPx =
    ellipse.size.width;

  const heightPx =
    ellipse.size.height;

  const diameterPx =
    (
      widthPx +
      heightPx
    ) / 2;

    const ratio =
  Math.min(
    widthPx,
    heightPx
  ) /
  Math.max(
    widthPx,
    heightPx
  );

if (
  ratio < 0.45
) {
  contour.delete();
  continue;
}

if (
  diameterPx < 15 ||
  diameterPx > 250
) {
  contour.delete();
  continue;
}

  const centerX =
  ellipse.center.x;

const centerY =
  ellipse.center.y;

const radius =
  diameterPx / 2;

const duplicate =
  detectedLogs.some(
    log => {

      const dist =
        Math.sqrt(
          (
            centerX -
            log.x
          ) ** 2 +
          (
            centerY -
            log.y
          ) ** 2
        );

      return (
        dist <
        radius * 0.7
      );
    }
  );

if (duplicate) {

  contour.delete();

  continue;
}

detectedLogs.push({
  x: centerX,
  y: centerY,
  r: radius,
});

diameters.push(
  diameterPx
);

logCount++;
/*
  cv.ellipse(
    src,
    ellipse,
    new cv.Scalar(
      0,
      255,
      0,
      255
    ),
    2
  );
*/

cv.circle(
  src,
  new cv.Point(
    ellipse.center.x,
    ellipse.center.y
  ),
  5,
  new cv.Scalar(
    0,
    255,
    0,
    255
  ),
  -1
);
  cv.putText(
  src,
  String(logCount),
  new cv.Point(
    centerX,
    centerY
  ),
  cv.FONT_HERSHEY_SIMPLEX,
  0.4,
  new cv.Scalar(
    255,
    255,
    0,
    255
  ),
  1
);

  contour.delete();
}

setEstimatedLogs(
  logCount
);

if (
  diameters.length > 0 &&
  cmPerPixel
) {

  const avgPixelDiameter =
    diameters.reduce(
      (a,b)=>a+b,
      0
    ) /
    diameters.length;

  avgDiameter =
    Number(
      (
        avgPixelDiameter *
        cmPerPixel
      ).toFixed(1)
    );
}

volume =
  Number(
    (
      logCount *
      Math.PI *
      Math.pow(
        avgDiameter / 100 / 2,
        2
      ) *
      l
    ).toFixed(2)
  );

cv.imshow(
  canvas,
  src
);

setGrayImage(
  canvas.toDataURL(
    "image/png"
  )
);

thresh.delete();
kernel.delete();
contours.delete();
hierarchy.delete();
clahe.delete();

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

      <div className="card">

  <h3>
    📏 Referencia tárgy
  </h3>

  <p>
    Add meg a képen látható
    ismert hosszúságot.
  </p>

  <input
    type="number"
    value={referenceLength}
    onChange={(e) =>
      setReferenceLength(
        e.target.value
      )
    }
  />

  <small>
    Példa:
    100 cm-es mérőléc
  </small>

</div>

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
    position: "relative",
    display: "inline-block",
  }}
>

          <img
  id="preview-image"
  src={previewUrl}
  alt="Rakat fotó"
  onClick={handleImageClick}
  style={{
    width: "100%",
    maxWidth: "600px",
    borderRadius: "12px",
    border:
      "1px solid rgba(0,216,255,.3)",
  }}
/>

{referenceStart && (

  <div
    style={{
      position: "absolute",
      left: referenceStart.x - 8,
      top: referenceStart.y - 8,
      width: 16,
      height: 16,
      borderRadius: "50%",
      background: "red",
      border: "2px solid white",
      pointerEvents: "none",
    }}
  />

)}

{referenceEnd && (

  <div
    style={{
      position: "absolute",
      left: referenceEnd.x - 8,
      top: referenceEnd.y - 8,
      width: 16,
      height: 16,
      borderRadius: "50%",
      background: "lime",
      border: "2px solid white",
      pointerEvents: "none",
    }}
  />

)}

{referenceStart &&
 referenceEnd && (

  <svg
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
    }}
  >

    <line
      x1={referenceStart.x}
      y1={referenceStart.y}
      x2={referenceEnd.x}
      y2={referenceEnd.y}
      stroke="yellow"
      strokeWidth="3"
    />

  </svg>

)}

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
{cmPerPixel && (

  <div className="card">

    <h3>
      📏 Kalibráció
    </h3>

    <p>
      1 pixel =
      {" "}
      {cmPerPixel.toFixed(4)}
      {" "}
      cm
    </p>

    <p>
      Referencia:
      {" "}
      {referenceLength}
      {" "}
      cm
    </p>

  </div>

)}
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

          <p>
  Skála:
  {" "}
  <strong>
    {cmPerPixel?.toFixed(4)}
    {" "}
    cm/px
  </strong>
</p>

        </div>

      )}

    </div>
  );
}