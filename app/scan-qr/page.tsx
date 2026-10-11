"use client";

import { useState } from "react";
import Link from "next/link";
import { QrCode, Search, ShoppingCart, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import DummyQR from "@/components/DummyQR";
import FadeIn from "@/components/FadeIn";

export default function ScanQR() {
  const [mode, setMode] = useState<"qr" | "plate">("qr");
  const [plateInput, setPlateInput] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateInput.trim()) return;
    setSearching(true);
    setSearchResult(null);

    setTimeout(() => {
      setSearching(false);
      setSearchResult(`Vehicle ${plateInput.toUpperCase()} is protected by Vyra Connect. Connecting to masked alert relay...`);
    }, 800);
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
            <div className="aspect-square bg-black/60 rounded-[2rem] border-2 border-cyan-500/30 flex items-center justify-center mb-6 p-10 relative overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]">
              <DummyQR className="w-full h-full max-w-full max-h-full opacity-70" />
              {/* Scanning Line */}
              <div className="absolute left-0 w-full h-1 bg-cyan-400 shadow-[0_0_20px_4px_#06b6d4] animate-scan-line z-10" />
            </div>

            <div className="text-center text-xs text-gray-400 font-medium tracking-wider uppercase mb-2">
              Point your smartphone camera at any Vyra Smart Tag
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
                {searching ? "Searching Database..." : "Search & Notify Owner"}
              </button>
            </div>

            {searchResult && (
              <div className="bg-cyan-950/40 border border-cyan-500/30 p-4 rounded-xl text-sm text-cyan-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>{searchResult}</div>
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
    </main>
  );
}
