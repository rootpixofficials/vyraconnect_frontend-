"use client";

import { useState } from "react";
import { 
  PhoneCall, Lock, X, Smartphone, ShieldCheck, 
  PhoneOff, AlertTriangle, ArrowRight, CheckCircle2
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
  ownerNumber?: string; // backwards compatibility
  ownerMasked?: string; // backwards compatibility
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

  const [automatedLoading, setAutomatedLoading] = useState(false);
  const [automatedSuccess, setAutomatedSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

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

  const defaultVirtual = "04954269245";
  const defaultDialHref = `tel:+91${defaultVirtual.replace(/^0/, "")}`;

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
      const dialHref = `tel:${cleanDial}`;

      const payload = {
        scannerMasked: data.scannerMasked || liveScannerMasked,
        targetMasked: data.targetMasked || resolvedTargetMasked,
        targetName: data.targetName || targetLabel,
        virtualNumber,
        dialNumber: dialHref,
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
        dialNumber: defaultDialHref,
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
      if (data.success) {
        setAutomatedSuccess(data.message || "Exotel is dialing your phone right now from our private number (04954269245). Please answer the call!");
      } else {
        setError(data.message || "Could not trigger automated call. Please dial directly using the button above.");
      }
    } catch (err: any) {
      setError("Network error triggering automated call. Please dial the private number directly.");
    } finally {
      setAutomatedLoading(false);
    }
  };

  const handleReset = () => {
    setCallInitiated(false);
    setCallData(null);
    setError(null);
    setAutomatedSuccess(null);
    setScannerPhone("");
    onClose();
  };

  const isEmergency = targetType === "emergency";

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={handleReset}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${
            isEmergency 
              ? 'bg-red-500/20 border-red-400/40 text-red-300' 
              : 'bg-cyan-500/20 border-cyan-400/30 text-cyan-300'
          } border text-[11px] font-mono uppercase tracking-wider mb-2`}>
            {isEmergency ? <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> : <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />}
            {isEmergency ? 'Emergency Masked Call' : '2-Way Privacy Relay'}
          </div>
          <h3 className="text-2xl font-extrabold text-white">
            {isEmergency ? 'Emergency Masked Call' : 'Private Masked Call'}
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Connecting to: <strong className={isEmergency ? "text-red-300" : "text-cyan-300"}>{targetLabel}</strong> ({plateNumber})
          </p>
        </div>

        {/* Visual Number Masking Diagram */}
        <div className="bg-black/50 border border-white/10 rounded-2xl p-4 mb-6">
          <div className="text-[10px] font-mono uppercase tracking-wider text-center text-gray-400 mb-3">
            Both Numbers Remain 100% Private
          </div>

          <div className="flex items-center justify-between text-center gap-2">
            {/* Scanner Side (You) */}
            <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-2.5">
              <Smartphone className="w-5 h-5 text-gray-300 mx-auto mb-1" />
              <div className="text-[10px] text-gray-400">Scanner (You)</div>
              <div className="text-[11px] font-mono font-bold text-cyan-300 mt-0.5">
                {callData?.scannerMasked || liveScannerMasked}
              </div>
            </div>

            {/* Shield Proxy Bridge */}
            <div className="flex flex-col items-center px-1">
              <div className={`w-9 h-9 rounded-full ${
                isEmergency 
                  ? 'bg-gradient-to-r from-red-600 to-amber-500' 
                  : 'bg-gradient-to-r from-blue-600 to-cyan-500'
              } text-white flex items-center justify-center shadow-lg`}>
                <Lock className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-mono text-gray-300 font-bold mt-1 uppercase">ExoPhone</span>
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
            <span>Neither party sees the other&apos;s real phone number</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs">
            {error}
          </div>
        )}

        {/* STEP 1: Enter Number OR Dial Directly */}
        {!callInitiated ? (
          <div className="space-y-4">
            {/* Quick 1-Tap Direct Call Option */}
            <div>
              <a
                href={defaultDialHref}
                className="w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 hover:from-blue-700 hover:to-cyan-600 active:scale-95 text-white font-extrabold py-3.5 px-4 rounded-xl border border-cyan-400/30 text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg text-center"
              >
                <PhoneCall className="w-4 h-4 text-white" />
                <span>Call Private Number Directly ({defaultVirtual})</span>
              </a>
              <p className="text-[10px] text-gray-400 text-center mt-1.5">
                No typing required &bull; Direct native dial to 2-way masked ExoPhone relay
              </p>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink mx-3 text-gray-400 text-[10px] font-mono uppercase">or register your number</span>
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
                Virtual Relay: <strong className="text-cyan-300 font-mono text-sm">{callData?.virtualNumber || defaultVirtual}</strong>
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
              <a
                href={callData?.dialNumber || defaultDialHref}
                className="w-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-600 hover:opacity-95 text-white font-black py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-lg transition active:scale-95 border border-emerald-400/50 cursor-pointer text-center"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Open Phone App & Dial ({callData?.virtualNumber || defaultVirtual})</span>
              </a>

              <p className="text-[10px] text-gray-400">
                Tap above to open your phone dialer. Both numbers remain 100% hidden.
              </p>
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
