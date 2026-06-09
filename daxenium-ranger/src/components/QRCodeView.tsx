import QRCode from "qrcode";
import { useEffect, useState } from "react";

interface Props {
  value: string;
}

export default function QRCodeView({
  value,
}: Props) {
  const [src, setSrc] =
    useState("");

  useEffect(() => {
    QRCode.toDataURL(value).then(
      setSrc
    );
  }, [value]);

  return <img src={src} />;
}