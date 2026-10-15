"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  QrCode, Car, Headphones, Wrench, ShieldCheck, 
  Users, MapPin, ArrowRight, ShoppingCart, Zap,
  Globe
} from "lucide-react";
import FadeIn from "@/components/FadeIn";

interface VehicleBannerProps {
  headlinePrefix?: string;
  headlineHighlight?: string;
  tagline?: string;
  defaultVehicle?: "car" | "bike";
  showSwitcher?: boolean;
  showPipeline?: boolean;
  showPillars?: boolean;
  showCta?: boolean;
  className?: string;
}

export default function VehicleBanner({
  headlinePrefix = "YOUR VEHICLE.",
  headlineHighlight = "YOUR NETWORK.",
  tagline = "Your Vehicle. Your Network.",
  defaultVehicle = "car",
  showSwitcher = true,
  showPipeline = true,
  showPillars = true,
  showCta = true,
  className = ""
}: VehicleBannerProps) {
  const [vehicle, setVehicle] = useState<"car" | "bike">(defaultVehicle);

  const vehicleData = {
    car: {
      name: "Stealth Hypercar",
      badge: "Automotive Dark Edition",
      src: "/images/vehicle-banner-car.webp",
      alt: "Vyra Connect Stealth Hypercar on Night Mountain Pass"
    },
    bike: {
      name: "Stealth Superbike",
      badge: "Superbike Carbon Edition",
      src: "/images/vehicle-banner-bike.webp",
      alt: "Vyra Connect Stealth Superbike with glowing cyan headlights"
    }
  };

  const current = vehicleData[vehicle];

  return (
    <div className={`relative w-full overflow-hidden border-y border-white/10 bg-[#030712] ${className}`}>
      
      {/* Ambient Atmospheric Glows */}
      <div className="absolute top-0 right-0 w-[650px] h-[650px] bg-cyan-500/10 blur-[160px] pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-0 w-[550px] h-[550px] bg-blue-600/10 blur-[150px] pointer-events-none -z-0" />

      {/* FULL WIDTH Vehicle Background Image (Edge-to-Edge) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <Image
          key={vehicle}
          src={current.src}
          alt={current.alt}
          fill
          priority
          className="object-cover object-center lg:object-right select-none transition-opacity duration-700"
        />
        {/* Gradients to dissolve image naturally into deep black on the left, top, and bottom */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#030712] via-[#030712]/90 lg:via-[#030712]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/70 via-transparent to-[#030712]/70" />
      </div>

      {/* Foreground Content Container - Normal Borders & Full-Width Grid Alignment */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 min-h-[600px] flex flex-col justify-between">
        
        {/* Top Row: Brand & Vehicle Switcher with Normal Borders */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded border border-cyan-500/40 bg-[#030712] p-1 shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center justify-center">
              <Image 
                src="/vyra-logo-navbar.png" 
                alt="Vyra Connect Logo" 
                width={32} 
                height={32} 
                className="object-contain" 
              />
            </div>
            <div>
              <div className="text-white font-extrabold tracking-widest text-sm sm:text-base font-heading">
                VYRA <span className="text-cyan-400">CONNECT</span>
              </div>
              <div className="text-[10px] sm:text-[11px] tracking-wider text-gray-400 font-mono">
                {tagline}
              </div>
            </div>
          </div>

          {/* Vehicle Switcher with Normal Borders (No pill / oval shape) */}
          {showSwitcher && (
            <div className="flex items-center gap-1 bg-black/70 backdrop-blur-md p-1 border border-white/15 rounded">
              <button
                type="button"
                onClick={() => setVehicle("car")}
                className={`px-4 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  vehicle === "car"
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                    : "text-gray-400 border-transparent hover:text-white"
                }`}
              >
                <Car className="w-3.5 h-3.5" /> Stealth Hypercar
              </button>
              <button
                type="button"
                onClick={() => setVehicle("bike")}
                className={`px-4 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  vehicle === "bike"
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                    : "text-gray-400 border-transparent hover:text-white"
                }`}
              >
                <Zap className="w-3.5 h-3.5" /> Stealth Superbike
              </button>
            </div>
          )}
        </div>

        {/* Middle Body: Grand Typography, Pipeline & Pillars */}
        <div className="my-auto max-w-2xl py-6">
          
          {/* Grand Headline */}
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight font-heading leading-[1.05] mb-6">
            {headlinePrefix} <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(6,182,212,0.4)]">
              {headlineHighlight}
            </span>
          </h2>

          {/* 4-Step Interactive Pipeline Flow with Normal Borders */}
          {showPipeline && (
            <div className="pt-2 pb-6">
              <div className="inline-flex flex-wrap items-center gap-2 sm:gap-3 bg-black/70 backdrop-blur-md p-2.5 sm:p-3 border border-white/15 rounded">
                
                {/* Step 1: SCAN */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-cyan-500/10 border border-cyan-400/40">
                  <QrCode className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-[11px] sm:text-xs font-bold font-mono tracking-wider text-cyan-300 uppercase">
                    Scan
                  </span>
                </div>

                <ArrowRight className="w-3.5 h-3.5 text-cyan-400/60 shrink-0 hidden sm:block" />

                {/* Step 2: VEHICLE OWNER */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-white/5 border border-white/15">
                  <Car className="w-4 h-4 text-gray-300 shrink-0" />
                  <span className="text-[11px] sm:text-xs font-bold font-mono tracking-wider text-gray-200 uppercase">
                    Vehicle Owner
                  </span>
                </div>

                <ArrowRight className="w-3.5 h-3.5 text-cyan-400/60 shrink-0 hidden sm:block" />

                {/* Step 3: ASSISTANCE */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-white/5 border border-white/15">
                  <Headphones className="w-4 h-4 text-gray-300 shrink-0" />
                  <span className="text-[11px] sm:text-xs font-bold font-mono tracking-wider text-gray-200 uppercase">
                    Assistance
                  </span>
                </div>

                <ArrowRight className="w-3.5 h-3.5 text-cyan-400/60 shrink-0 hidden sm:block" />

                {/* Step 4: SERVICE NETWORK */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-white/5 border border-white/15">
                  <Wrench className="w-4 h-4 text-gray-300 shrink-0" />
                  <span className="text-[11px] sm:text-xs font-bold font-mono tracking-wider text-gray-200 uppercase">
                    Service Network
                  </span>
                </div>

              </div>
            </div>
          )}

          {/* 3 Core Security Pillars with Normal Borders */}
          {showPillars && (
            <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
              <div className="flex items-center gap-2.5 bg-black/60 border border-white/15 p-2.5 rounded backdrop-blur-sm">
                <div className="w-8 h-8 rounded bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-400/30">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white leading-tight">Vehicle Security</div>
                  <div className="text-[9px] text-gray-400 font-mono">100% Number Masked</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-black/60 border border-white/15 p-2.5 rounded backdrop-blur-sm">
                <div className="w-8 h-8 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-400/30">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white leading-tight">Assistance & SOS</div>
                  <div className="text-[9px] text-gray-400 font-mono">Instant Emergency</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-black/60 border border-white/15 p-2.5 rounded backdrop-blur-sm">
                <div className="w-8 h-8 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-400/30">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white leading-tight">Always Connected</div>
                  <div className="text-[9px] text-gray-400 font-mono">24/7 Smart Radar</div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Row: Footer Branding & CTAs with Normal Borders */}
        <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          
          {/* Tagline & Domain */}
          <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
            <span className="font-bold text-gray-300 tracking-wider">
              Scan. Connect. Resolve.
            </span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
              <Globe className="w-3.5 h-3.5" /> vyraconnect.in
            </span>
          </div>

          {/* CTAs with Normal Borders */}
          {showCta && (
            <div className="flex items-center gap-3">
              <Link
                href="/buy"
                className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 text-white font-extrabold px-5 py-2.5 rounded text-xs sm:text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-cyan-400/40"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                Get Vyra Kit (₹399)
              </Link>
              <Link
                href="/scan-qr"
                className="bg-black/70 hover:bg-white/10 text-white font-bold px-4 py-2.5 rounded text-xs sm:text-sm border border-white/20 transition-all flex items-center gap-1.5 backdrop-blur-md"
              >
                <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                Try Scanner
              </Link>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
