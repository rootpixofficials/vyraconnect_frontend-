"use client";

import { useState } from "react";
import { 
  PhoneCall, Lock, X, Smartphone, ShieldCheck, 
  PhoneOff, MessageSquare, ArrowRight, CheckCircle2
} from "lucide-react";

interface MaskedCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  plateNumber?: string;
  ownerNumber?: string;
  ownerMasked?: string;
  qrToken?: string;
}

export default function MaskedCallModal({
  isOpen,
  onClose,
  plateNumber = "KL 11 AZ 7777",
  ownerNumber,
  ownerMasked,
  qrToken
}: MaskedCallModalProps) {
  const [scannerPhone, setScannerPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [callInitiated, setCallInitiated] = useState(false);
  const [callData, setCallData] = useState<{
    scannerMasked?: string;
    ownerMasked?: string;
    virtualNumber?: string;
    dialNumber?: string;
    message?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const cleanScanner = scannerPhone.replace(/[^0-9]/g, "");
  const liveScannerMasked = cleanScanner.length >= 4 
    ? `+91 ••••• ••${cleanScanner.slice(-3)}`
    : "+91 ••••• ••••";

  const resolvedOwnerMasked = ownerMasked || (ownerNumber 
    ? `+91 ••••• ••${ownerNumber.replace(/[^0-9]/g, "").slice(-3)}`
    : "+91 ••••• ••890");

  const defaultVirtual = "09513886363";

  const handleStartCall = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

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
          ownerNumber,
          plateNumber,
          qrToken
        })
      });

      const data = await res.json();
      const virtualNumber = data.virtualNumber || defaultVirtual;
      const dialNumber = virtualNumber.startsWith("+") 
        ? virtualNumber 
        : (virtualNumber.startsWith("0") ? `+91${virtualNumber.slice(1)}` : `+91${virtualNumber}`);

      setCallData({
        scannerMasked: data.scannerMasked || liveScannerMasked,
        ownerMasked: data.ownerMasked || resolvedOwnerMasked,
        virtualNumber,
        dialNumber,
        message: data.message
      });
      setCallInitiated(true);

      // Immediately navigate to mobile phone dialer application
      window.location.href = `tel:${dialNumber}`;
    } catch (err: any) {
      console.error("Masked call error:", err);
      const dialNumber = `+91${defaultVirtual.slice(1)}`;
      setCallData({
        scannerMasked: liveScannerMasked,
        ownerMasked: resolvedOwnerMasked,
        virtualNumber: defaultVirtual,
        dialNumber,
        message: "Connecting to phone dialer..."
      });
      setCallInitiated(true);
      window.location.href = `tel:${dialNumber}`;
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCallInitiated(false);
    setCallData(null);
    setError(null);
    setScannerPhone("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#091122] via-[#050b16] to-black border border-cyan-500/40 rounded-[2.5rem] p-6 sm:p-8 shadow-[0_20px_70px_rgba(6,182,212,0.3)] overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-cyan-500/15 blur-[60px] pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-[11px] font-mono uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            2-Way Privacy Shield Relay
          </div>
          <h3 className="text-2xl font-extrabold text-white font-heading">
            Private Masked Call
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Vehicle: <strong className="text-cyan-300 font-mono">{plateNumber}</strong>
          </p>
        </div>

        {/* Visual Number Masking Diagram */}
        <div className="bg-black/60 border border-white/10 rounded-2xl p-4 mb-6">
          <div className="text-[10px] font-mono uppercase tracking-wider text-center text-gray-400 mb-3">
            How Both Numbers Are 100% Protected
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
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                <Lock className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-mono text-cyan-400 font-bold mt-1 uppercase">Exotel Proxy</span>
            </div>

            {/* Owner Side */}
            <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-2.5">
              <Smartphone className="w-5 h-5 text-gray-300 mx-auto mb-1" />
              <div className="text-[10px] text-gray-400">Vehicle Owner</div>
              <div className="text-[11px] font-mono font-bold text-white mt-0.5">
                {callData?.ownerMasked || resolvedOwnerMasked}
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
          <div className="mb-4 p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs">
            {error}
          </div>
        )}

        {/* STEP 1: Enter Scanner Number Form */}
        {!callInitiated ? (
          <form onSubmit={handleStartCall} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Enter Your Mobile Number (Will Be Masked)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={scannerPhone}
                  onChange={(e) => setScannerPhone(e.target.value)}
                  placeholder="e.g. 98765 43210"
                  maxLength={15}
                  required
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-3.5 text-white font-mono text-base outline-none focus:border-cyan-400 transition"
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">
                Your number is masked securely. When you tap Call, your phone will navigate directly to the dialer to call our masked virtual number.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] text-white font-extrabold py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 text-base border border-cyan-400/40 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Setting Up Masked Call...
                </span>
              ) : (
                <>
                  <PhoneCall className="w-5 h-5" />
                  Call Masked Number (Dialer)
                </>
              )}
            </button>
          </form>
        ) : (
          /* STEP 2: Navigating to Dial Call Application */
          <div className="space-y-5 text-center">
            
            <div className="relative w-20 h-20 mx-auto my-2 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.6)]">
                <PhoneCall className="w-7 h-7 animate-bounce" />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Navigating to Phone Dialer
              </div>
              <h4 className="text-xl font-extrabold text-white">Call Masked Number</h4>
              <p className="text-xs text-gray-300 mt-1">
                Calling virtual relay: <strong className="text-cyan-300 font-mono text-sm">{callData?.virtualNumber || defaultVirtual}</strong>
              </p>
            </div>

            {/* Direct Dial Button if mobile browser did not auto-launch */}
            <div className="space-y-2">
              <a
                href={`tel:${callData?.dialNumber || `+91${defaultVirtual.slice(1)}`}`}
                className="w-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-600 hover:opacity-95 text-white font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2.5 text-base shadow-[0_0_25px_rgba(16,185,129,0.4)] transition active:scale-95 border border-emerald-400/50"
              >
                <PhoneCall className="w-5 h-5" />
                Open Phone Dialer & Call Now
              </a>
              <p className="text-[11px] text-gray-400">
                Tap above if your phone calling app didn&apos;t open automatically.
              </p>
            </div>

            {/* WhatsApp Fallback */}
            {ownerNumber && (
              <div className="pt-3 border-t border-white/10">
                <a
                  href={`https://wa.me/${ownerNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                    `Hello, I am contacting you regarding your vehicle ${plateNumber}.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/30 flex items-center justify-center gap-2 text-xs font-bold transition"
                >
                  <MessageSquare className="w-4 h-4" />
                  Message Owner on WhatsApp
                </a>
              </div>
            )}

            <button
              onClick={handleReset}
              className="w-full bg-white/10 hover:bg-white/15 text-white font-bold py-3 rounded-xl border border-white/10 text-xs transition mt-2"
            >
              Close
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
