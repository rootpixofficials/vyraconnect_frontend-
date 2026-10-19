"use client";

import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";

interface DummyQRProps {
  className?: string;
  value?: string;
  token?: string;
}

export default function DummyQR({ className = "", value, token = "demo" }: DummyQRProps) {
  // Cloudways test app URL as default fallback so phone camera scans immediately navigate to the test environment
  const [qrValue, setQrValue] = useState<string>(
    value || `https://phpstack-1650272-6724559.cloudwaysapps.com/scan?token=${token}`
  );

  useEffect(() => {
    if (value) {
      setQrValue(value);
      return;
    }
    if (typeof window !== "undefined") {
      const origin = window.location.origin;
      // Use current window origin if on test server (or custom domain)
      if (origin && !origin.includes("localhost") && !origin.includes("127.0.0.1")) {
        setQrValue(`${origin}/scan?token=${token}`);
      } else {
        // If testing on localhost, use the public Cloudways test link so mobile phones on cellular/WiFi can access it
        setQrValue(`https://phpstack-1650272-6724559.cloudwaysapps.com/scan?token=${token}`);
      }
    }
  }, [value, token]);

  return (
    <div className={`flex items-center justify-center p-2 bg-white rounded-xl ${className}`}>
      <QRCode
        value={qrValue}
        size={256}
        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        viewBox="0 0 256 256"
      />
    </div>
  );
}
