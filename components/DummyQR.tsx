"use client";

import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { getAppBaseUrl, rewriteToCurrentDomain, TEST_APP_URL } from "@/lib/config";

interface DummyQRProps {
  className?: string;
  value?: string;
  size?: number;
}

export default function DummyQR({ className = "", value, size = 256 }: DummyQRProps) {
  // Start with test URL so server-side pre-render has test domain
  const [resolvedValue, setResolvedValue] = useState<string>(() => {
    if (value) return rewriteToCurrentDomain(value);
    return `${TEST_APP_URL}/scan?token=demo`;
  });

  useEffect(() => {
    if (value) {
      setResolvedValue(rewriteToCurrentDomain(value));
    } else {
      const base = getAppBaseUrl();
      setResolvedValue(`${base}/scan?token=demo`);
    }
  }, [value]);

  return (
    <div className={`flex items-center justify-center p-2 bg-white rounded-xl ${className}`}>
      <QRCode
        value={resolvedValue}
        size={size}
        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        viewBox={`0 0 256 256`}
      />
    </div>
  );
}
