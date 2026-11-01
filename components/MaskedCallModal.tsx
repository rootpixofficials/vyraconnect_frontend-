"use client";

import { useState } from "react";
import { 
  PhoneCall, Lock, X, Smartphone, ShieldCheck, 
  PhoneOff, AlertTriangle, CheckCircle2, Copy, Check
} from "lucide-react";

interface MaskedCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  plateNumber?: string;
  targetType?: "owner" | "emergency";
  targetLabel?: string;
  targetName?: string;
  targetNumber?: string;
  targetMasked?: string;
  ownerNumber?: string;
  ownerMasked?: string;
  qrToken?: string;
}

export default function MaskedCallModal({
  isOpen,
  onClose,
  plateNumber = "KL 11 AZ 7777",
  targetType = "owner",
  targetLabel = "Vehicle Owner",
  targetName,
  targetNumber,
  targetMasked,
  ownerNumber,
  ownerMasked,
  qrToken
}: MaskedCallModalProps) {
  const [scannerPhone, setScannerPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [callInitiated, setCallInitiated] = useState(false);
  const [callData, setCallData] = useState<{
    scannerMasked?: string;
    targetMasked?: string;
    targetName?: string;
    virtualNumber?: string;
    dialNumber?: string;
    message?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [automatedLoading, setAutomatedLoading] = useState(false);
  const [automatedSuccess, setAutomatedSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const defaultVirtual = "04954269245";
  const activeVirtual = callData?.virtualNumber || defaultVirtual;
  const cleanVirtual = activeVirtual.replace(/[^0-9]/g, "");

  const resolvedTargetNumber = targetNumber 
    ? String(targetNumber) 
    : (ownerNumber ? String(ownerNumber) : undefined);
  const cleanScanner = String(scannerPhone || "").replace(/[^0-9]/g, "");
  const liveScannerMasked = cleanScanner.length >= 4 
    ? `+91 ••••• ••${cleanScanner.slice(-3)}`
    : "+91 ••••• ••••";

  const cleanTarget = resolvedTargetNumber ? String(resolvedTargetNumber).replace(/[^0-9]/g, "") : "";
  const resolvedTargetMasked = targetMasked || ownerMasked || (cleanTarget 
    ? `+91 ••••• ••${cleanTarget.slice(-3)}`
    : "+91 ••••• ••890");

  // Safe call trigger that never crashes Chrome iOS into "This page couldn't load"
  const triggerSafeDial = (number: string) => {
    const digits = number.replace(/[^0-9+]/g, "");
    const telUrl = `tel:${digits}`;

    if (typeof window === "undefined") return;

    try {
      let iframe = document.getElementById("vyra-tel-iframe") as HTMLIFrameElement;
      if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.id = "vyra-tel-iframe";
        iframe.style.display = "none";
        document.body.appendChild(iframe);
      }
      iframe.src = telUrl;
    } catch {
      window.location.href = telUrl;
    }
  };

  const handleCopyNumber = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(cleanVirtual).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }).catch(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleStartCall = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setAutomatedSuccess(null);

    if (cleanScanner.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/call/mask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scannerNumber: scannerPhone,
          targetNumber: resolvedTargetNumber,
          targetType,
          targetName: targetName || targetLabel,
          plateNumber,
          qrToken,
          mode: "dialer"
        })
      });

      const data = await res.json();
      const virtualNumber = data.virtualNumber || defaultVirtual;
      const cleanDial = (data.dialNumber || `+91${virtualNumber.replace(/^0/, "")}`).replace(/^tel:/, "");

      const payload = {
        scannerMasked: data.scannerMasked || liveScannerMasked,
        targetMasked: data.targetMasked || resolvedTargetMasked,
        targetName: data.targetName || targetLabel,
        virtualNumber,
        dialNumber: `tel:${cleanDial}`,
        message: data.message
      };

      setCallData(payload);
      setCallInitiated(true);
    } catch (err: any) {
      console.error("Masked call setup error:", err);
      setCallData({
        scannerMasked: liveScannerMasked,
        targetMasked: resolvedTargetMasked,
        targetName: targetLabel,
        virtualNumber: defaultVirtual,
        dialNumber: `tel:+91${defaultVirtual.replace(/^0/, "")}`,
        message: "Masked privacy session active."
      });
      setCallInitiated(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAutomatedCallback = async () => {
    if (cleanScanner.length < 10) {
      setError("Please enter a valid 10-digit mobile number above first.");
      return;
    }

    setAutomatedLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/call/mask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scannerNumber: scannerPhone,
          targetNumber: resolvedTargetNumber,
          targetType,
          targetName: targetName || targetLabel,
          plateNumber,
          qrToken,
          mode: "automated"
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Automated call failed.");
      }

      setAutomatedSuccess(
        `Calling you now on +91 ••••• ••${cleanScanner.slice(-3)}! Pick up to connect privately.`
      );
    } catch (err: any) {
      setError(err.message || "Could not trigger callback. Use Direct Dialing below.");
    } finally {
      setAutomatedLoading(false);
    }
  };

  const handleReset = () => {
    setCallInitiated(false);
    setScannerPhone("");
    setError(null);
    setAutomatedSuccess(null);
    onClose();
  };

  const isEmergency = targetType === "emergency";

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative w-full max-w-md bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-white overflow-hidden max-h-[92vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl ${
              isEmergency 
                ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
            } flex items-center justify-center`}>
              {isEmergency ? <AlertTriangle className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isEmergency ? 'bg-red-950 text-red-300 border border-red-700/50' : 'bg-cyan-950 text-cyan-300 border border-cyan-700/50'
                }`}>
                  {isEmergency ? 'Emergency Relay' : '2-Way Masked Protection'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                {targetLabel || (isEmergency ? 'Emergency Contact' : 'Vehicle Owner')}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2-Way Privacy Diagram */}
        <div className="bg-black/50 border border-white/10 rounded-2xl p-3.5 mb-4 text-center">
          <div className="flex items-center justify-between text-xs">
            {/* Scanner Side */}
            <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-2.5">
              <Smartphone className="w-5 h-5 text-gray-300 mx-auto mb-1" />
              <div className="text-[10px] text-gray-400">You (Scanner)</div>
              <div className="text-[11px] font-mono font-bold text-cyan-300 mt-0.5">
                {callData?.scannerMasked || liveScannerMasked}
              </div>
            </div>

            {/* ExoPhone Middle Lock */}
            <div className="px-2 flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full ${
                isEmergency 
                  ? 'bg-gradient-to-r from-red-600 to-amber-500' 
                  : 'bg-gradient-to-r from-blue-600 to-cyan-500'
              } text-white flex items-center justify-center shadow-lg`}>
                <Lock className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-mono text-gray-300 font-bold mt-1 uppercase">Relay</span>
            </div>

            {/* Recipient Side */}
            <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-2.5">
              <Smartphone className="w-5 h-5 text-gray-300 mx-auto mb-1" />
              <div className="text-[10px] text-gray-400">{isEmergency ? 'Emergency Contact' : 'Vehicle Owner'}</div>
              <div className="text-[11px] font-mono font-bold text-white mt-0.5">
                {callData?.targetMasked || resolvedTargetMasked}
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-white/5 text-[11px] text-center text-gray-400 flex items-center justify-center gap-1.5">
            <PhoneOff className="w-3.5 h-3.5 text-cyan-400" />
            <span>Neither party sees the other&apos;s personal phone number</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs">
            {error}
          </div>
        )}

        {/* PRIMARY CALL ACTION AREA */}
        {!callInitiated ? (
          <div className="space-y-4">
            {/* Quick 1-Tap Direct Call Option */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => triggerSafeDial(activeVirtual)}
                className="w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 hover:from-blue-700 hover:to-cyan-600 active:scale-95 text-white font-extrabold py-3.5 px-4 rounded-xl border border-cyan-400/30 text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg text-center"
              >
                <PhoneCall className="w-4 h-4 text-white" />
                <span>Call Private Number ({activeVirtual})</span>
              </button>

              <button
                type="button"
                onClick={handleCopyNumber}
                className="w-full bg-white/10 hover:bg-white/15 active:scale-95 text-gray-200 font-semibold py-2.5 px-4 rounded-xl border border-white/10 text-xs transition flex items-center justify-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                <span>{copied ? "Virtual Number Copied!" : `Copy Number: ${activeVirtual}`}</span>
              </button>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink mx-3 text-gray-400 text-[10px] font-mono uppercase">or automated callback</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            <form onSubmit={handleStartCall} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Enter Your Mobile Number (For Masked Bridge)
                </label>
                <input
                  type="tel"
                  value={scannerPhone}
                  onChange={(e) => setScannerPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  maxLength={15}
                  required
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-white font-mono text-base outline-none focus:border-cyan-400 transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white/10 hover:bg-white/15 text-white font-bold py-3 px-3 rounded-xl border border-white/10 text-xs transition flex items-center justify-center gap-1.5"
                >
                  {loading ? "Preparing..." : "1. Setup Dialer Session"}
                </button>

                <button
                  type="button"
                  onClick={handleAutomatedCallback}
                  disabled={automatedLoading}
                  className="w-full bg-cyan-600/30 hover:bg-cyan-600/40 text-cyan-200 font-bold py-3 px-3 rounded-xl border border-cyan-500/30 text-xs transition flex items-center justify-center gap-1.5"
                >
                  {automatedLoading ? "Calling..." : "2. Automated Callback"}
                </button>
              </div>

              {automatedSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs text-center">
                  ✅ {automatedSuccess}
                </div>
              )}
            </form>
          </div>
        ) : (
          /* STEP 2: Dial Registered Masked Number */
          <div className="space-y-4 text-center">
            <div className="relative w-16 h-16 mx-auto my-1 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-7 h-7" />
              </div>
            </div>

            <div>
              <h4 className="text-lg font-extrabold text-white">Masked Bridge Ready</h4>
              <p className="text-xs text-gray-300 mt-1">
                Virtual Relay: <strong className="text-cyan-300 font-mono text-sm">{activeVirtual}</strong>
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-left space-y-1.5 text-xs text-gray-300">
              <div className="flex justify-between">
                <span className="text-gray-400">Target:</span>
                <span className="font-bold text-white">{callData?.targetName || targetLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Your Number:</span>
                <span className="font-mono text-cyan-300 font-bold">{callData?.scannerMasked} (Masked)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Recipient Number:</span>
                <span className="font-mono text-white font-bold">{callData?.targetMasked} (Masked)</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => triggerSafeDial(activeVirtual)}
                className="w-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-600 hover:opacity-95 text-white font-black py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-lg transition active:scale-95 border border-emerald-400/50 cursor-pointer text-center"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Open Phone App & Dial ({activeVirtual})</span>
              </button>

              <button
                type="button"
                onClick={handleCopyNumber}
                className="w-full bg-white/10 hover:bg-white/15 active:scale-95 text-gray-200 font-semibold py-2.5 px-4 rounded-xl border border-white/10 text-xs transition flex items-center justify-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
                <span>{copied ? "Virtual Number Copied!" : `Copy Number: ${activeVirtual}`}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="w-full bg-white/10 hover:bg-white/15 text-white font-bold py-2.5 rounded-xl border border-white/10 text-xs transition"
            >
              Done / Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
