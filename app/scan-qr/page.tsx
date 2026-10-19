"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  QrCode, Search, ShoppingCart, ArrowRight, CheckCircle2, 
  PhoneOff, PhoneCall, ShieldCheck, MessageSquare
} from "lucide-react";
import DummyQR from "@/components/DummyQR";
import FadeIn from "@/components/FadeIn";
import MaskedCallModal from "@/components/MaskedCallModal";

export default function ScanQR() {
  const [mode, setMode] = useState<"qr" | "plate">("qr");
  const [plateInput, setPlateInput] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<{ plate: string; found: boolean } | null>(null);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [activePlateForCall, setActivePlateForCall] = useState("KL 11 AZ 7777");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateInput.trim()) return;
    setSearching(true);
    setSearchResult(null);

    setTimeout(() => {
      setSearching(false);
      setSearchResult({
        plate: plateInput.toUpperCase(),
        found: true
      });
      setActivePlateForCall(plateInput.toUpperCase());
    }, 600);
  };

  const openCallForPlate = (plate: string) => {
    setActivePlateForCall(plate);
    setIsCallModalOpen(true);
  };

  return (
    <main className="py-24 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto overflow-hidden">
      <FadeIn className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 font-heading">Connect with Owner</h1>
        <p className="text-lg text-gray-400">Scan physical Vyra Tag or look up vehicle registration plate.</p>
      </FadeIn>

      <FadeIn delay={0.2} direction="up" className="bg-white/5 backdrop-blur-md border border-white/10 p-8 sm:p-10 rounded-[3rem] shadow-2xl relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/10 blur-[100px] rounded-full -z-10" />
        
        {/* Mode Selector */}
        <div className="flex gap-4 mb-8">
          <button 
            type="button"
            onClick={() => { setMode("qr"); setSearchResult(null); }}
            className={`flex-1 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition ${
              mode === "qr"
                ? "bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                : "bg-black/40 text-gray-400 hover:text-white border border-white/10"
            }`}
          >
            <QrCode className="w-5 h-5" /> Scan QR
          </button>
          <button 
            type="button"
            onClick={() => { setMode("plate"); setSearchResult(null); }}
            className={`flex-1 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition ${
              mode === "plate"
                ? "bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                : "bg-black/40 text-gray-400 hover:text-white border border-white/10"
            }`}
          >
            <Search className="w-5 h-5" /> Plate Number
          </button>
        </div>
        
        {mode === "qr" ? (
          <div>
            <Link 
              href="/scan?token=demo"
              className="block group"
              title="Click or tap to open test vehicle screen directly"
            >
              <div className="aspect-square bg-black/60 rounded-[2rem] border-2 border-cyan-500/30 group-hover:border-cyan-400 flex items-center justify-center mb-4 p-8 sm:p-10 relative overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] cursor-pointer transition">
                <DummyQR className="w-full h-full max-w-full max-h-full opacity-80 group-hover:opacity-100 transition" />
                {/* Scanning Line */}
                <div className="absolute left-0 w-full h-1 bg-cyan-400 shadow-[0_0_20px_4px_#06b6d4] animate-scan-line z-10" />
                
                <div className="absolute bottom-4 bg-black/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-cyan-400/50 text-[11px] font-mono text-cyan-300 shadow-lg flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  Tap to open test link or scan with phone
                </div>
              </div>
            </Link>

            <div className="text-center text-xs text-gray-400 font-medium tracking-wider uppercase mb-5">
              Point your smartphone camera at this QR code or tap to open test link
            </div>

            {/* Quick Demo Triggers for testing */}
            <div className="bg-black/50 border border-white/10 rounded-2xl p-4 text-center space-y-2">
              <span className="text-xs text-gray-400">Testing on this device?</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                <Link
                  href="/scan?token=demo"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold rounded-xl py-3 px-4 text-xs flex items-center justify-center gap-2 transition shadow-md"
                >
                  <QrCode className="w-4 h-4 text-black" />
                  Open Test Vehicle (/scan)
                </Link>
                <button
                  type="button"
                  onClick={() => openCallForPlate("KL 11 AZ 7777")}
                  className="w-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 rounded-xl py-3 px-4 font-bold text-xs flex items-center justify-center gap-2 transition"
                >
                  <PhoneCall className="w-4 h-4 text-cyan-400" />
                  Test 2-Way Masked Call
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSearch} className="space-y-4 mb-4">
            <div className="bg-black/50 border border-white/15 rounded-2xl p-6 text-center space-y-4">
              <label className="block text-xs font-mono uppercase text-gray-400">
                Enter Vehicle Plate Registration:
              </label>
              <input 
                type="text" 
                value={plateInput}
                onChange={(e) => setPlateInput(e.target.value.toUpperCase())}
                placeholder="e.g. KL 11 AZ 7777" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center text-xl font-mono font-bold tracking-widest text-white outline-none focus:border-cyan-400 transition"
              />
              <button 
                type="submit" 
                disabled={searching}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-3.5 rounded-xl hover:opacity-90 transition flex items-center justify-center gap-2"
              >
                {searching ? "Searching Database..." : "Search Vehicle"}
              </button>
            </div>

            {searchResult && (
              <div className="bg-gradient-to-b from-[#071326] to-black border border-cyan-500/40 p-5 rounded-2xl shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-bold text-white">Vehicle Protected by Vyra</span>
                  </div>
                  <span className="text-xs font-mono text-cyan-300 font-bold bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-md">
                    {searchResult.plate}
                  </span>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between text-xs text-gray-300">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    Privacy Shield Active
                  </span>
                  <span className="font-mono text-emerald-400 font-semibold">
                    Owner: +91 ••••• ••890
                  </span>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => openCallForPlate(searchResult.plate)}
                    className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs shadow-md hover:opacity-95 transition"
                  >
                    <PhoneCall className="w-4 h-4" />
                    Masked Call
                  </button>

                  <a
                    href={`https://wa.me/919746910890?text=${encodeURIComponent(
                      `Hello, I am parked near your vehicle (${searchResult.plate}) and need assistance.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 hover:bg-white/15 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs border border-white/10 transition"
                  >
                    <MessageSquare className="w-4 h-4 text-cyan-400" />
                    Send Alert
                  </a>
                </div>

                <Link
                  href={`/scan?token=demo`}
                  className="w-full bg-white/5 hover:bg-white/10 text-cyan-300 border border-cyan-500/30 font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs transition"
                >
                  <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                  Open Full Vehicle Emergency Page (/scan)
                </Link>
              </div>
            )}
          </form>
        )}

        {/* Bottom Banner */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-gray-400 mb-3">Want a smart tag for your own car or motorcycle?</p>
          <Link 
            href="/buy" 
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-bold text-sm"
          >
            <ShoppingCart className="w-4 h-4" />
            Buy Official Vyra Tag (Free Express Delivery) <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </FadeIn>

      {/* 2-Way Masked Call Modal */}
      <MaskedCallModal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        plateNumber={activePlateForCall}
      />
    </main>
  );
}
