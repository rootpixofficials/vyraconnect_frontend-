"use client";

import { QrCode, Search } from "lucide-react";
import DummyQR from "@/components/DummyQR";
import FadeIn from "@/components/FadeIn";

export default function ScanQR() {
  return (
    <main className="py-20 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto overflow-hidden">
      <FadeIn className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4 font-heading">Scan QR or Enter Plate</h1>
        <p className="text-xl text-gray-400">Instantly notify the owner or activate a new tag.</p>
      </FadeIn>

      <FadeIn delay={0.2} direction="up" className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[3rem] shadow-2xl relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full -z-10" />
        
        <div className="flex gap-4 mb-10">
          <button className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            <QrCode className="w-5 h-5" /> Scan QR
          </button>
          <button className="flex-1 bg-black/40 text-white py-4 rounded-2xl font-bold hover:bg-black/60 border border-white/10 transition flex items-center justify-center gap-2">
            <Search className="w-5 h-5" /> Plate Number
          </button>
        </div>
        
        <div className="aspect-square bg-black/50 rounded-[2rem] border-2 border-blue-500/30 flex items-center justify-center mb-8 p-12 relative overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]">
          <DummyQR className="w-full h-full max-w-full max-h-full opacity-70" />
          {/* Scanning Line */}
          <div className="absolute left-0 w-full h-1 bg-blue-400 shadow-[0_0_20px_4px_#3b82f6] animate-scan-line z-10" />
        </div>

        <div className="text-center text-sm text-gray-400 font-medium tracking-wide">
          CAMERA ACCESS REQUIRED
        </div>
      </FadeIn>
    </main>
  );
}
