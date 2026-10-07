import React from "react";
import QRCode from "react-qr-code";

interface DummyQRProps {
  className?: string;
}

export default function DummyQR({ className = "" }: DummyQRProps) {
  return (
    <div className={`flex items-center justify-center p-2 bg-white rounded-xl ${className}`}>
      <QRCode
        value="https://vyraconnect.com/scan/dummy"
        size={256}
        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        viewBox={`0 0 256 256`}
      />
    </div>
  );
}
