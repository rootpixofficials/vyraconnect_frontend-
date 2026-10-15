"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  QrCode, Car, Headphones, Wrench, ShieldCheck, 
  Users, MapPin, ArrowRight, Sparkles, ShoppingCart, Zap,
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
      alt: "Vyra Connect Stealth Hypercar on Night Mountain Pass",
      tagHotspot: { top: "54%", left: "62%", label: "Windshield Smart Tag" },
      lookupHotspot: { top: "66%", left: "54%", label: "Masked Plate Detection" }
    },
    bike: {
      name: "Stealth Superbike",
      badge: "Superbike Carbon Edition",
      src: "/images/vehicle-banner-bike.webp",
      alt: "Vyra Connect Stealth Superbike with glowing cyan headlights",
      tagHotspot: { top: "42%", left: "68%", label: "Tank / Fairing Tag" },
      lookupHotspot: { top: "68%", left: "60%", label: "Instant Rider Radar" }
    }
  };

  const current = vehicleData[vehicle];

  return (
    <FadeIn>
      <div className={`relative rounded-[2.5rem] sm:rounded-[3rem] bg-[#030712] border border-cyan-500/30 overflow-hidden shadow-[0_20px_80px_rgba(6,182,212,0.18)] ${className}`}>
        
        {/* Background Ambient Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none -z-0" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none -z-0" />

        {/* Right Half: Seamless Vehicle Image */}
        <div className="absolute inset-0 lg:left-[25%] pointer-events-none">
          <Image
            key={vehicle}
            src={current.src}
            alt={current.alt}
            fill
            priority
            className="object-cover object-center lg:object-right transition-opacity duration-700 select-none"
          />
          {/* Gradients to seamlessly blend the vehicle into dark background on left, top and bottom */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#030712] via-[#030712]/90 lg:via-[#030712]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-[#030712]/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/60 via-transparent to-[#030712]" />
        </div>

        {/* Foreground Content Container */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-14 min-h-[580px] sm:min-h-[620px] flex flex-col justify-between">
          
          {/* Top Row: Brand & Vehicle Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            {/* Brand Logo & Tagline */}
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 p-0.5 shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center">
                <div className="w-full h-full bg-[#030712] rounded-[10px] flex items-center justify-center">
                  <Image 
                    src="/images/vyra-logo-navbar.png" 
                    alt="Vyra Connect Logo" 
                    width={28} 
                    height={28} 
                    className="object-contain" 
                  />
                </div>
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

            {/* Vehicle Switcher Pill Toggle */}
            {showSwitcher && (
              <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md p-1 rounded-full border border-white/10 shadow-lg">
                <button
                  type="button"
                  onClick={() => setVehicle("car")}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                    vehicle === "car"
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Car className="w-3.5 h-3.5" /> Car
                </button>
                <button
                  type="button"
                  onClick={() => setVehicle("bike")}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                    vehicle === "bike"
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" /> Superbike
                </button>
              </div>
            )}
          </div>

          {/* Middle Body: Grand Typography & Pipeline */}
          <div className="my-auto max-w-2xl py-6">
            
            {/* Grand Headline */}
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight font-heading leading-[1.05] mb-6">
              {headlinePrefix} <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(6,182,212,0.4)]">
                {headlineHighlight}
              </span>
            </h2>

            {/* 4-Step Interactive Pipeline Flow (Reference Banner Pattern) */}
            {showPipeline && (
              <div className="pt-2 pb-6">
                <div className="inline-flex flex-wrap items-center gap-2 sm:gap-3 bg-black/60 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-white/10 shadow-xl">
                  
                  {/* Step 1: SCAN */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-400/30">
                    <QrCode className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="text-[11px] sm:text-xs font-bold font-mono tracking-wider text-cyan-300 uppercase">
                      Scan
                    </span>
                  </div>

                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400/60 shrink-0 hidden sm:block" />

                  {/* Step 2: VEHICLE OWNER */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                    <Car className="w-4 h-4 text-gray-300 shrink-0" />
                    <span className="text-[11px] sm:text-xs font-bold font-mono tracking-wider text-gray-200 uppercase">
                      Vehicle Owner
                    </span>
                  </div>

                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400/60 shrink-0 hidden sm:block" />

                  {/* Step 3: ASSISTANCE */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                    <Headphones className="w-4 h-4 text-gray-300 shrink-0" />
                    <span className="text-[11px] sm:text-xs font-bold font-mono tracking-wider text-gray-200 uppercase">
                      Assistance
                    </span>
                  </div>

                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400/60 shrink-0 hidden sm:block" />

                  {/* Step 4: SERVICE NETWORK */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                    <Wrench className="w-4 h-4 text-gray-300 shrink-0" />
                    <span className="text-[11px] sm:text-xs font-bold font-mono tracking-wider text-gray-200 uppercase">
                      Service Network
                    </span>
                  </div>

                </div>
              </div>
            )}

            {/* 3 Core Security Pillars (Reference Banner 2 Pattern) */}
            {showPillars && (
              <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
                <div className="flex items-center gap-2.5 bg-black/40 border border-white/10 p-2.5 rounded-xl backdrop-blur-sm">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-400/30">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-white leading-tight">Vehicle Security</div>
                    <div className="text-[9px] text-gray-400 font-mono">100% Number Masked</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 bg-black/40 border border-white/10 p-2.5 rounded-xl backdrop-blur-sm">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-400/30">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-white leading-tight">Assistance & SOS</div>
                    <div className="text-[9px] text-gray-400 font-mono">Instant Emergency</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 bg-black/40 border border-white/10 p-2.5 rounded-xl backdrop-blur-sm">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-400/30">
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

          {/* Bottom Row: Footer Branding & CTAs */}
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

            {/* CTAs */}
            {showCta && (
              <div className="flex items-center gap-3">
                <Link
                  href="/buy"
                  className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 text-white font-extrabold px-5 py-2.5 rounded-full text-xs sm:text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-cyan-400/30"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Get Vyra Kit (₹399)
                </Link>
                <Link
                  href="/scan-qr"
                  className="bg-black/60 hover:bg-white/10 text-white font-bold px-4 py-2.5 rounded-full text-xs sm:text-sm border border-white/15 transition-all flex items-center gap-1.5 backdrop-blur-md"
                >
                  <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                  Try Scanner
                </Link>
              </div>
            )}

          </div>

        </div>

      </div>
    </FadeIn>
  );
}
