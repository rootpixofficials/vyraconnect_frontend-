"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Preloader from "@/components/Preloader";
import FadeIn from "@/components/FadeIn";
import ContactForm from "@/components/ContactForm";
import DummyQR from "@/components/DummyQR";
import VehicleBanner from "@/components/VehicleBanner";
import { 
  Bell, MessageSquare, PhoneOff, QrCode, CheckCircle2, 
  Star, ShieldCheck, Smartphone, ArrowRight, Car, MapPin, Mail,
  Sparkles, Shield, Zap, Lock, EyeOff, Cpu, ShoppingCart, 
  ChevronRight, Award, Check
} from "lucide-react";

export default function Home() {
  // State for interactive simulation in Section 2
  const [activeTab, setActiveTab] = useState<"alert" | "chat" | "lost">("alert");
  const [selectedVehicle, setSelectedVehicle] = useState<"car" | "bike">("car");
  const [simulatedAlertCount, setSimulatedAlertCount] = useState(1);

  return (
    <main className="relative overflow-hidden selection:bg-cyan-500 selection:text-black">
      <Preloader />

      {/* AMBIENT BACKGROUND GLOWS */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-cyan-600/15 via-blue-900/10 to-transparent blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[1200px] left-0 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] pointer-events-none -z-10" />
      <div className="absolute top-[2200px] right-0 w-[600px] h-[600px] bg-cyan-600/10 blur-[150px] pointer-events-none -z-10" />

      {/* =========================================================================
          SECTION 1: HERO SECTION (FIRST SCREEN - LUXURY BLACK CAR SHOWCASE)
          ========================================================================= */}
      <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Heading, Value Props & Actions (7 cols) */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-6">
            <FadeIn direction="right">
              {/* Futuristic Cyber Badge */}
              <div className="inline-flex items-center gap-2 border border-cyan-500/30 bg-gradient-to-r from-cyan-500/15 to-blue-600/10 text-cyan-300 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase mb-4 shadow-[0_0_25px_rgba(6,182,212,0.25)]">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                Next-Gen Vehicle Identity & Privacy
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight font-heading leading-[1.08] mb-4">
                Park Freely. <br />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(6,182,212,0.4)]">
                  Stay Untouchable.
                </span>
              </h1>

              {/* Sub-headline */}
              <p className="text-lg md:text-xl text-gray-300 font-normal leading-relaxed max-w-xl">
                When someone scans your vehicle, you receive an instant encrypted alert. They reach you seamlessly — but <span className="text-cyan-300 font-semibold">never see your phone number</span>.
              </p>

              {/* Interactive Feature Pills */}
              <div className="flex flex-wrap gap-3 py-2">
                <span className="flex items-center gap-2 bg-black/40 border border-white/10 px-3.5 py-2 rounded-xl text-xs sm:text-sm text-gray-200 backdrop-blur-md shadow-sm">
                  <PhoneOff className="w-4 h-4 text-cyan-400 shrink-0" /> Number 100% Hidden
                </span>
                <span className="flex items-center gap-2 bg-black/40 border border-white/10 px-3.5 py-2 rounded-xl text-xs sm:text-sm text-gray-200 backdrop-blur-md shadow-sm">
                  <Zap className="w-4 h-4 text-cyan-400 shrink-0" /> Instant Alert &lt;0.4s
                </span>
                <span className="flex items-center gap-2 bg-black/40 border border-white/10 px-3.5 py-2 rounded-xl text-xs sm:text-sm text-gray-200 backdrop-blur-md shadow-sm">
                  <MessageSquare className="w-4 h-4 text-cyan-400 shrink-0" /> Masked Chat • Call • SMS
                </span>
              </div>

              {/* Primary Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <Link 
                  href="/buy" 
                  className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 text-white px-8 py-3.5 rounded-full font-extrabold text-base hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 border border-cyan-400/40 shadow-lg"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Get Vyra Smart Tag
                </Link>
                <Link 
                  href="/scan-qr" 
                  className="bg-black/60 border border-white/20 text-white px-7 py-3.5 rounded-full font-bold text-base hover:bg-white/10 hover:border-cyan-400/50 transition-all flex items-center gap-2 backdrop-blur-md shadow-sm"
                >
                  <QrCode className="w-5 h-5 text-cyan-400" />
                  Scan QR Code
                </Link>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-3 pt-4 text-xs text-gray-400">
                <div className="flex text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <span>Trusted by <strong>1,200+</strong> premium car owners across India</span>
              </div>
            </FadeIn>
          </div>

          {/* Right Column: iPhone 18 Pro Scanning Mockup (5 cols) */}
          <div className="lg:col-span-5 xl:col-span-5 relative mt-12 lg:mt-0 flex justify-center lg:justify-end items-center">
            <FadeIn direction="left" delay={0.2} className="relative flex justify-center lg:justify-end lg:translate-x-10 xl:translate-x-16">
              
              {/* Ambient Glow behind Phone */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[580px] bg-gradient-to-tr from-cyan-500/25 to-blue-600/20 blur-[90px] rounded-full pointer-events-none -z-10" />

              {/* iPhone 18 Pro Frame */}
              <div className="relative w-[310px] sm:w-[335px] h-[640px] sm:h-[660px] bg-[#070b12] rounded-[3.5rem] border-[10px] sm:border-[12px] border-[#1a1f2c] shadow-[0_25px_80px_rgba(6,182,212,0.3),0_0_50px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col ring-1 ring-white/15">
                
                {/* Dynamic Island */}
                <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-30 flex items-center justify-between px-3 shadow-inner">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#101b2b] border border-blue-900/60" />
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] font-mono font-bold text-cyan-300">SCAN</span>
                  </div>
                </div>

                {/* Speaker Ear-piece Line */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-white/10 rounded-full z-30" />

                {/* Phone Screen Inner Container */}
                <div className="flex-1 bg-gradient-to-b from-[#060c18] via-[#040812] to-black relative flex flex-col pt-14 px-5 pb-6 overflow-hidden">
                  
                  {/* Status Bar */}
                  <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono px-2 mb-4">
                    <span>9:41</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] tracking-wider text-cyan-400 font-bold">VYRA 5G</span>
                      <div className="w-5 h-2.5 border border-gray-400 rounded-sm p-0.5 flex items-center">
                        <div className="w-full h-full bg-white rounded-2xs" />
                      </div>
                    </div>
                  </div>

                  {/* Header in Camera App */}
                  <div className="text-center mb-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-[10px] font-mono uppercase tracking-wider mb-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                      Camera Viewfinder
                    </div>
                    <h3 className="text-white text-base font-bold font-heading">Scan Vehicle Tag</h3>
                    <p className="text-gray-400 text-xs">Align the QR code within the frame</p>
                  </div>

                  {/* Viewfinder Frame with animated laser scan line */}
                  <div className="relative aspect-square w-full rounded-2xl border border-cyan-500/40 bg-black/60 p-4 flex items-center justify-center shadow-[0_0_35px_rgba(6,182,212,0.15)] overflow-hidden">
                    
                    {/* Corner Targeting Brackets */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400 rounded-tl-sm" />
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400 rounded-tr-sm" />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400 rounded-bl-sm" />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400 rounded-br-sm" />

                    {/* Animated Scanning Laser Line */}
                    <div className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_3px_#06b6d4] animate-scan-line z-20 pointer-events-none" />

                    {/* Virtual Vyra Tag Inside Frame */}
                    <div className="relative w-full h-full rounded-xl bg-gradient-to-b from-[#0b1322] to-[#040812] border border-cyan-400/30 p-2.5 flex flex-col items-center justify-between shadow-inner">
                      <div className="flex items-center justify-between w-full px-1">
                        <div className="relative w-16 h-4">
                          <Image src="/vyra-logo-navbar.png" alt="Vyra" fill className="object-contain object-left" />
                        </div>
                        <span className="text-[8px] font-mono text-cyan-400 font-bold">SMART TAG</span>
                      </div>
                      
                      <div className="p-2 bg-white rounded-lg shadow-md my-0.5">
                        <DummyQR className="w-20 h-20 p-0" />
                      </div>

                      <div className="flex items-center justify-between w-full text-[8px] font-mono text-gray-400 px-1">
                        <span>ID: VYRA-001234</span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> ACTIVE
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Scanned Result Card */}
                  <div className="mt-3 bg-gradient-to-r from-cyan-950/40 via-black/80 to-blue-950/40 border border-cyan-500/40 rounded-xl p-3 shadow-lg">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-xs font-bold text-white">Vehicle Identified</span>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400 font-bold">0.38s</span>
                    </div>
                    <div className="text-[11px] text-gray-300 flex items-center justify-between">
                      <span>Porsche Taycan 4S</span>
                      <span className="text-[10px] font-mono text-gray-400">KL-11-AZ-7777</span>
                    </div>

                    {/* Quick Masked Actions */}
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-extrabold text-[11px] py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 shadow-md hover:opacity-90">
                        <PhoneOff className="w-3 h-3 text-black" /> Masked Call
                      </button>
                      <button className="bg-white/10 hover:bg-white/15 text-white font-bold text-[11px] py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 border border-white/10">
                        <MessageSquare className="w-3 h-3 text-cyan-400" /> Send Alert
                      </button>
                    </div>
                  </div>

                  {/* Home Indicator */}
                  <div className="mt-auto pt-2">
                    <div className="w-28 h-1 bg-white/30 rounded-full mx-auto" />
                  </div>
                </div>
              </div>

              {/* Floating Badges Outside Phone */}
              <div className="hidden sm:flex absolute -top-4 -right-6 bg-black/90 backdrop-blur-xl border border-cyan-400/40 px-3.5 py-2 rounded-2xl shadow-xl items-center gap-2.5 z-20">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 font-mono">Scan Latency</div>
                  <div className="text-xs font-bold text-cyan-300">Instant &lt;0.4s</div>
                </div>
              </div>

              <div className="hidden sm:flex absolute -bottom-4 -left-6 bg-black/90 backdrop-blur-xl border border-emerald-500/40 px-3.5 py-2 rounded-2xl shadow-xl items-center gap-2.5 z-20">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 font-mono">Privacy Shield</div>
                  <div className="text-xs font-bold text-emerald-400">Number 100% Hidden</div>
                </div>
              </div>

            </FadeIn>
          </div>

        </div>
      </section>

      {/* STATS STRIP */}
      <section className="border-y border-white/10 bg-black/40 backdrop-blur-xl py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-extrabold text-cyan-400 font-heading">0.4s</div>
              <div className="text-xs sm:text-sm text-gray-400 mt-1">Instant Push Notification</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-extrabold text-cyan-400 font-heading">100%</div>
              <div className="text-xs sm:text-sm text-gray-400 mt-1">Caller ID & Phone Masking</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-extrabold text-cyan-400 font-heading">10 Years</div>
              <div className="text-xs sm:text-sm text-gray-400 mt-1">UV & Weatherproof Durability</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-extrabold text-cyan-400 font-heading">₹0</div>
              <div className="text-xs sm:text-sm text-gray-400 mt-1">Monthly Subscription Fees</div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: OFFICIAL VEHICLE SHOWCASE BANNER ("YOUR VEHICLE. YOUR NETWORK.")
          Designed directly matching official Vyra Connect brand specifications
          ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden">
        
        {/* Section Header */}
        <FadeIn className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 border border-blue-500/30 bg-blue-500/10 text-cyan-400 rounded-full px-4 py-1 text-xs font-bold tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Breathtaking Engineering
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-heading tracking-tight mb-4">
            Built for World-Class Machines.
          </h2>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed">
            From bespoke black hypercars to superbikes cutting through night fog — Vyra Connect turns your vehicle into a privately connected fortress.
          </p>
        </FadeIn>

        {/* Master Showcase Vehicle Banner (Seamless car/bike with pipeline & pillars) */}
        <VehicleBanner className="mb-12" />

        {/* Interactive Live Demo: Experience the Alert in Real-Time */}
        <FadeIn delay={0.2} className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-b from-white/10 via-black/80 to-black border border-cyan-500/30 rounded-[2.5rem] p-6 sm:p-10 backdrop-blur-2xl shadow-[0_20px_60px_rgba(6,182,212,0.15)]">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-mono">Live Simulation</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading mt-0.5">
                  Experience How Vyra Alerts You
                </h3>
              </div>
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full text-emerald-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live Cloud Relay Ready
              </div>
            </div>

            {/* Tabs */}
            <div className="grid grid-cols-3 gap-2 bg-black/60 p-1.5 rounded-2xl border border-white/10 mb-6">
              <button
                type="button"
                onClick={() => setActiveTab("alert")}
                className={`py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                  activeTab === "alert" 
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/25" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                1. Parking Ping
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("chat")}
                className={`py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                  activeTab === "chat" 
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/25" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                2. Masked Chat
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("lost")}
                className={`py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                  activeTab === "lost" 
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/25" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                3. Lost Mode
              </button>
            </div>

            {/* Dynamic Tab Content Preview */}
            <div className="bg-black/70 border border-white/10 rounded-2xl p-5 sm:p-6 mb-6 min-h-[170px] flex flex-col justify-between shadow-inner">
              {activeTab === "alert" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-400/30">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Incoming Instant Parking Alert</div>
                      <div className="text-xs text-gray-400">Scanner selected: "Car blocking my driveway"</div>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                    "Your vehicle (KL 11 AZ 7777) was scanned at Lulu Mall Parking B2. Scanner requested you to move forward 2 meters."
                  </p>
                </div>
              )}

              {activeTab === "chat" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-400/30">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Masked 2-Way Chat Relay</div>
                      <div className="text-xs text-gray-400">Owner Mobile: +91 ••••• ••••90 (100% Encrypted & Hidden)</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs sm:text-sm pt-2">
                    <div className="bg-blue-600/30 border border-blue-400/20 text-blue-200 p-3 rounded-xl max-w-[85%]">
                      Scanner: "Hey, lights are left on in your car!"
                    </div>
                    <div className="bg-white/10 text-white p-3 rounded-xl max-w-[85%] ml-auto text-right border border-white/10">
                      You: "Thank you so much! Heading over right now."
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "lost" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-400/30">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Lost Mode Community Ping</div>
                      <div className="text-xs text-rose-300 font-semibold">Active Emergency Beacon Triggered</div>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                    "Vehicle reported missing. Scanner location pinned at Calicut Beach Road. Tipster provided photos to recovery team."
                  </p>
                </div>
              )}

              <div className="pt-3 mt-2 flex items-center justify-between text-xs text-gray-400 border-t border-white/5">
                <span>Relay Speed: <strong className="text-cyan-400">0.38s</strong></span>
                <span className="text-cyan-400 font-medium">End-to-End Encrypted</span>
              </div>
            </div>

            {/* Direct Action Link to /buy */}
            <Link
              href="/buy"
              className="w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] text-white font-extrabold py-3.5 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm border border-cyan-400/30"
            >
              <ShoppingCart className="w-4 h-4" />
              Equip Your Vehicle Today (From ₹399)
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* =========================================================================
          SECTION 2.5: OFFICIAL PRODUCT KIT SHOWCASE (₹399 CONNECT KIT)
          ========================================================================= */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-blue-600/10 via-cyan-500/15 to-blue-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />

        <FadeIn className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Complete Hardware Kit • ₹399
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-heading tracking-tight mb-4">
            One Vehicle. One Vyra.
          </h2>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Everything you need in a single premium box. Mount the smart tag to your vehicle, keep the portable tag on your keys, and carry your ID card everywhere.
          </p>
        </FadeIn>

        {/* Big Kit Display Box */}
        <FadeIn>
          <div className="relative rounded-[3rem] bg-gradient-to-b from-white/10 via-black/80 to-black border border-cyan-500/30 p-6 sm:p-10 backdrop-blur-2xl shadow-[0_20px_80px_rgba(6,182,212,0.2)] mb-12 overflow-hidden group">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              
              {/* Left: Kit Box Image */}
              <div className="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <Image 
                  src="/images/vyra-kit-showcase.jpg" 
                  alt="Vyra Connect Kit Official Packaging and Hardware" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700" 
                  priority 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-300 bg-black/80 px-3 py-1.5 rounded-xl border border-white/10">
                    OFFICIAL HARDWARE SUITE
                  </span>
                  <span className="text-sm font-extrabold text-white bg-cyan-500/30 border border-cyan-400/50 px-4 py-1.5 rounded-xl">
                    ₹399 ALL-INCLUSIVE
                  </span>
                </div>
              </div>

              {/* Right: What You Get List */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">Unbox Complete Safety</span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading mt-1">
                    What's Inside The Box
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-400/30 font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Bike & Car QR Smart Sticker</h4>
                      <p className="text-xs text-gray-400 mt-0.5">30mm × 45mm • Waterproof • UV Resistant • 10-Yr Matte Finish</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-400/30 font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Portable Keyring Tag</h4>
                      <p className="text-xs text-gray-400 mt-0.5">30mm × 45mm • 0.8mm Durable PVC/ABS with Keyring Hole</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-400/30 font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Official Vehicle ID Card</h4>
                      <p className="text-xs text-gray-400 mt-0.5">85.6mm × 54mm • Wallet-friendly PVC Card with Emergency QR</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-400/30 font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Quick Setup & Emergency Guide</h4>
                      <p className="text-xs text-gray-400 mt-0.5">Instant 60-second activation instructions inside box</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/buy"
                    className="w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 text-white font-extrabold py-4 px-6 rounded-2xl text-center shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 text-base border border-cyan-400/30"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Get Your Complete Kit Now (₹399)
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </FadeIn>
      </section>

      {/* =========================================================================
          SECTION 3: CORE CAPABILITIES (GRID OF 6 PILLARS)
          ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <FadeIn className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-heading mb-4">Everything You Need for Vehicle Peace of Mind</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-base">Engineered with bank-grade privacy and automotive durability.</p>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Private QR Contact",
              desc: "Anyone can scan your smart tag to send parking alerts without ever learning your phone number or identity.",
              icon: QrCode
            },
            {
              title: "Lost Mode Beacon",
              desc: "Mark your vehicle lost with 1 tap. Scanners immediately see recovery instructions and send GPS tips.",
              icon: MapPin
            },
            {
              title: "Multi-Vehicle Garage",
              desc: "Manage multiple cars, superbikes, and family vehicles effortlessly from a single master dashboard.",
              icon: Car
            },
            {
              title: "Digital Document Locker",
              desc: "Store Registration Certificate (RC), Insurance, and Pollution PUC securely in your encrypted mobile vault.",
              icon: ShieldCheck
            },
            {
              title: "Masked Voice & SMS Relay",
              desc: "Talk through proxy routing numbers. Never worry about spam, harassment, or unwanted follow-up calls.",
              icon: PhoneOff
            },
            {
              title: "10-Year Weatherproof Guarantee",
              desc: "Engineered from aerospace-grade UV polymers that withstand intense monsoons, heat, and pressure washing.",
              icon: Award
            }
          ].map((item, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all hover:border-cyan-500/40 hover:-translate-y-1 duration-300 h-full shadow-lg">
                <item.icon className="w-10 h-10 text-cyan-400 mb-6" />
                <h3 className="text-xl font-bold text-white mb-3 font-heading">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.4} className="text-center mt-12">
          <Link 
            href="/features" 
            className="inline-flex items-center gap-2 bg-blue-600/20 text-cyan-300 px-8 py-3.5 rounded-full font-bold hover:bg-blue-600/30 transition border border-cyan-500/30"
          >
            Explore All 12 Platform Features <ArrowRight className="w-4 h-4" />
          </Link>
        </FadeIn>
      </section>

      {/* =========================================================================
          SECTION 4: 3-STEP EASY SETUP
          ========================================================================= */}
      <section className="py-20 bg-blue-950/20 border-y border-white/5 backdrop-blur-md overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-heading mb-4">How Vyra Connect Works</h2>
            <p className="text-gray-400 text-base max-w-xl mx-auto">Zero technical installation. Ready in under 60 seconds.</p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8 text-center mb-12">
            <FadeIn delay={0.1}>
              <div className="w-20 h-20 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                <QrCode className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-white font-heading mb-2">1. Stick & Activate</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">Peel the 3M sticker, mount to your windshield, and scan once to link your plate.</p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="w-20 h-20 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                <MessageSquare className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-white font-heading mb-2">2. Park Anywhere</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">When parked, anyone who needs you simply scans the code with any smartphone camera.</p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="w-20 h-20 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-white font-heading mb-2">3. Stay Protected</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">Receive alerts and reply through masked channels. Your phone number stays 100% private.</p>
            </FadeIn>
          </div>

          <FadeIn delay={0.4} className="text-center">
            <Link 
              href="/how-it-works" 
              className="inline-flex items-center gap-2 text-cyan-400 font-bold hover:text-cyan-300 transition text-base"
            >
              Read Complete Setup & Activation Guide <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: CUSTOMER REVIEWS
          ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <FadeIn className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-12 font-heading">
            What Vehicle Owners Are Saying
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-lg relative">
              <div className="flex text-amber-400 mb-6">
                <Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" />
              </div>
              <p className="text-gray-300 mb-8 italic leading-relaxed text-base">
                "Installed Vyra on my BMW M340i. Last week someone blocked me in a narrow mall parking space. They scanned the tag and I got an instant ping and masked call without having to leave my number on paper. Superb product!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center font-bold text-white text-lg">V</div>
                <div>
                  <h4 className="font-bold text-white">Aditya Menon</h4>
                  <span className="text-sm text-gray-500">Kochi, Kerala • Verified Owner</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-lg relative">
              <div className="flex text-amber-400 mb-6">
                <Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" />
              </div>
              <p className="text-gray-300 mb-8 italic leading-relaxed text-base">
                "The build quality of the sticker is top tier! It looks like an OEM factory part on my car window. 60 seconds setup and no monthly subscription charges at all. Highly recommended for all car owners."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center font-bold text-white text-lg">R</div>
                <div>
                  <h4 className="font-bold text-white">Rohit Nair</h4>
                  <span className="text-sm text-gray-500">Calicut, Kerala • Verified Owner</span>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* =========================================================================
          SECTION 6: CONTACT & ASSISTANCE
          ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <FadeIn>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/15 blur-[120px] rounded-full -z-10" />
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 font-heading">Need Assistance?</h2>
                <p className="text-gray-400 mb-8 text-base leading-relaxed">
                  Have questions about ordering custom batch tags, fleet integration, or need help setting up? Our support team in Calicut is ready to help.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-4 bg-black/40 px-6 py-4 rounded-2xl border border-white/5 w-fit">
                    <MapPin className="w-6 h-6 text-cyan-400 shrink-0" />
                    <div>
                      <div className="text-xs text-gray-400">Headquarters</div>
                      <div className="text-white font-medium">Calicut, Kerala, India</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-black/40 px-6 py-4 rounded-2xl border border-white/5 w-fit">
                    <Mail className="w-6 h-6 text-cyan-400 shrink-0" />
                    <div>
                      <div className="text-xs text-gray-400">Direct Support</div>
                      <div className="text-white font-medium">vyraconnect.in@gmail.com</div>
                    </div>
                  </div>
                </div>
                
                <Link href="/contact" className="inline-flex items-center gap-2 text-cyan-400 font-bold hover:text-cyan-300 transition text-base">
                  View Full Contact Info & FAQ <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="bg-black/40 p-8 rounded-[2rem] border border-white/10 shadow-inner">
                <h3 className="text-xl font-bold text-white mb-6 font-heading">Send Us a Direct Message</h3>
                <ContactForm />
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* =========================================================================
          SECTION 7: FINAL HIGH-CONVERTING CTA BANNER
          ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <FadeIn className="relative rounded-[3rem] bg-gradient-to-r from-blue-900/40 via-cyan-900/30 to-black border border-cyan-500/40 p-12 md:p-16 overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.25)]">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-heading">
              Ready to Upgrade Your Vehicle?
            </h2>
            <p className="text-gray-300 text-base md:text-lg">
              Get your official Vyra Smart Tag delivered directly to your doorstep. Free express shipping across India.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link
                href="/buy"
                className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 text-white font-extrabold px-9 py-4 rounded-full text-lg shadow-[0_0_35px_rgba(6,182,212,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Order Smart Tag Now (From ₹399)
              </Link>
              <Link
                href="/features"
                className="bg-black/60 border border-white/20 text-white font-bold px-8 py-4 rounded-full text-lg hover:bg-white/10 transition"
              >
                Learn More
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>

    </main>
  );
}
