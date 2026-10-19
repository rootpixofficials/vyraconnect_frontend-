"use client";

import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { ACTIVE_TEST_SCAN_URL, rewriteToCurrentDomain } from "@/lib/config";

interface DummyQRProps {
  className?: string;
  value?: string;
  token?: string;
  size?: number;
}

export default function DummyQR({ className = "", value, size = 256 }: DummyQRProps) {
  // Always initialize with public test URL (never localhost or production live domain)
  const [qrValue, setQrValue] = useState<string>(() => {
    if (value) return rewriteToCurrentDomain(value);
    return ACTIVE_TEST_SCAN_URL;
  });

  useEffect(() => {
    if (value) {
      setQrValue(rewriteToCurrentDomain(value));
    } else {
      setQrValue(ACTIVE_TEST_SCAN_URL);
    }
  }, [value]);

  return (
    <div className={`flex items-center justify-center p-2 bg-white rounded-xl ${className}`}>
      <QRCode
        value={qrValue}
        size={size}
        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        viewBox="0 0 256 256"
      />
    </div>
  );
}
