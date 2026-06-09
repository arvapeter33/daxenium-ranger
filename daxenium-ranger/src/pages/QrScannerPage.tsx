import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

interface Props {
  onScan: (id: string) => void;
}

export default function QrScannerPage({
  onScan,
}: Props) {

  useEffect(() => {

    const scanner =
      new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: 250,
        },
        false
      );

    scanner.render(

      (decodedText) => {

        try {

          const data =
            JSON.parse(decodedText);

          onScan(data.id);

        } catch {

          onScan(decodedText);

        }

        scanner.clear();

      },

      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };

  }, []);

  return (

    <div className="page-container">

      <h1 className="page-title">
        📷 QR Beolvasás
      </h1>

      <div className="card">

        <div
          id="qr-reader"
          style={{
            width: "100%",
          }}
        />

      </div>

    </div>
  );
}