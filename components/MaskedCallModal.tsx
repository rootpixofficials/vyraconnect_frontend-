"use client";

import { useState } from "react";
import { 
  PhoneCall, Shield, Lock, X, CheckCircle2, AlertCircle, 
  Smartphone, ArrowRight, ShieldCheck, PhoneOff, Radio, MessageSquare, ExternalLink
} from "lucide-react";

interface MaskedCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  plateNumber?: string;
  ownerMasked?: string;
  qrToken?: string;
}

export default function MaskedCallModal({
  isOpen,
  onClose,
  plateNumber = "KL 11 AZ 7777",
  ownerMasked = "+91 ••••• ••890",
  qrToken
}: MaskedCallModalProps) {
  const [scannerPhone, setScannerPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [callInitiated, setCallInitiated] = useState(false);
  const [callData, setCallData] = useState<{
    scannerMasked?: string;
    ownerMasked?: string;
    virtualNumber?: string;
    kycPending?: boolean;
    message?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartCall = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const clean = scannerPhone.replace(/[^0-9]/g, "");
    if (clean.length < 10) {
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
          plateNumber,
          qrToken
        })
      });

      const data = await res.json();

      if (res.ok && (data.success || data.kycPending)) {
        setCallInitiated(true);
        setCallData(data);
      } else {
        setError(data.error || data.message || "Failed to initiate masked call.");
      }
    } catch (err: any) {
      console.error("Masked call error:", err);
      setError("Network error connecting to call gateway. Please try again.");
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
            
            {/* Scanner Side */}
            <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-2.5">
              <Smartphone className="w-5 h-5 text-gray-300 mx-auto mb-1" />
              <div className="text-[10px] text-gray-400">Scanner</div>
              <div className="text-[11px] font-mono font-bold text-white mt-0.5">
                {callData?.scannerMasked || "+91 ••••• ••••"}
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
              <div className="text-[10px] text-gray-400">Owner</div>
              <div className="text-[11px] font-mono font-bold text-white mt-0.5">
                {ownerMasked}
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
          <div className="mb-4 p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs space-y-3">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="font-medium leading-relaxed">{error}</div>
            </div>

            {error.includes("Credit") || error.includes("balance") || error.includes("recharge") ? (
              <div className="pt-2 border-t border-amber-500/20 space-y-2">
                <p className="text-[11px] text-gray-300">
                  Exotel requires positive balance to route PSTN calls. While you top up Exotel, you can reach the owner instantly:
                </p>
                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <a
                    href={`https://wa.me/919746910890?text=${encodeURIComponent(
                      `Hello! I am scanning the QR code for vehicle ${plateNumber}. Please contact me.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 flex items-center justify-center gap-1.5 text-[11px] font-bold transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    WhatsApp Owner
                  </a>
                  <a
                    href="tel:+919746910890"
                    className="flex-1 py-2 px-3 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-cyan-300 flex items-center justify-center gap-1.5 text-[11px] font-bold transition"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    Direct Phone Call
                  </a>
                </div>
              </div>
            ) : null}

            {error.includes("ExoPhone") && (
              <div className="pt-2 border-t border-amber-500/20 text-[11px] text-gray-300">
                Log in to <strong className="text-white">my.exotel.com</strong> &gt; copy your assigned virtual number &gt; provide it to update <code className="text-cyan-300 bg-black/40 px-1.5 py-0.5 rounded">EXOTEL_CALLER_ID</code>.
              </div>
            )}
          </div>
        )}

        {/* STEP 1: Enter Scanner Number Form */}
        {!callInitiated ? (
          <form onSubmit={handleStartCall} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Your Mobile Number (Exotel will dial you first, then connect)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={scannerPhone}
                  onChange={(e) => setScannerPhone(e.target.value)}
                  placeholder="e.g. 98765 43210"
                  required
                  className="w-full bg-black/50 border border-white/15 rounded-xl px-4 py-3.5 text-white font-mono text-base outline-none focus:border-cyan-400 transition"
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">
                We will bridge the call through a virtual proxy number. Your number is never revealed to the car owner.
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
                  Connecting Secure Gateway...
                </span>
              ) : (
                <>
                  <PhoneCall className="w-5 h-5" />
                  Start Masked Call Now
                </>
              )}
            </button>
          </form>
        ) : (
          /* STEP 2: Call Initiated Live Status */
          <div className="space-y-4 text-center">
            
            <div className="relative w-20 h-20 mx-auto my-2 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-cyan-500/20 animate-ping" />
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.6)]">
                <PhoneCall className="w-7 h-7 animate-bounce" />
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold text-white">Call Dispatched via Exotel</h4>
              <p className="text-xs text-gray-300 mt-1">
                Your phone will ring shortly from the <span className="text-cyan-300 font-bold">Vyra Virtual Number</span>. Pick up to speak with the owner!
              </p>
            </div>

            {/* KYC Notice if pending */}
            {callData?.kycPending && (
              <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-3.5 text-left text-xs text-amber-200">
                <strong className="block text-amber-300 font-bold mb-0.5">Exotel Account Active</strong>
                Your Exotel API is connected! Outbound audio will physically ring as soon as Exotel finishes your business KYC review.
              </div>
            )}

            <button
              onClick={handleReset}
              className="w-full bg-white/10 hover:bg-white/15 text-white font-bold py-3.5 rounded-xl border border-white/10 text-sm transition"
            >
              Done / Close
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
