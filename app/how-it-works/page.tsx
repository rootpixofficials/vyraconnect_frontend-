"use client";

import Link from "next/link";
import { MessageSquare, ShieldCheck, ShoppingCart, QrCode } from "lucide-react";
import DummyQR from "@/components/DummyQR";
import FadeIn from "@/components/FadeIn";
import VehicleBanner from "@/components/VehicleBanner";

export default function HowItWorks() {
  return (
    <main className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      <FadeIn className="text-center mb-16">
        <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4 font-heading">How Vyra Connect Works</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">One intelligent QR tag. Seamless, privacy-protected vehicle communication.</p>
      </FadeIn>

      <div className="grid md:grid-cols-3 gap-8 text-center relative mb-16">
        <FadeIn delay={0.1} direction="right" className="bg-white/5 backdrop-blur-md p-10 rounded-[3rem] border border-white/10 shadow-lg relative">
          <div className="w-20 h-20 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
            <DummyQR className="w-12 h-12 p-1" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4 font-heading">1. Scan</h3>
          <p className="text-gray-400 leading-relaxed">Scan any Vyra Tag QR sticker or look up a plate with any phone camera to initiate contact instantly.</p>
        </FadeIn>
        
        <FadeIn delay={0.2} direction="up" className="bg-white/5 backdrop-blur-md p-10 rounded-[3rem] border border-white/10 shadow-lg relative">
          <div className="w-20 h-20 bg-blue-500/20 text-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.25)]">
            <MessageSquare className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4 font-heading">2. Connect</h3>
          <p className="text-gray-400 leading-relaxed">Send parking notifications, masked 2-way chat, or voice alerts without revealing private numbers.</p>
        </FadeIn>
        
        <FadeIn delay={0.3} direction="left" className="bg-white/5 backdrop-blur-md p-10 rounded-[3rem] border border-white/10 relative overflow-hidden shadow-lg">
           <div className="absolute top-0 left-0 w-full h-1.5 bg-cyan-500 shadow-[0_0_15px_#06b6d4]" />
          <div className="w-20 h-20 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4 font-heading">3. Protect</h3>
          <p className="text-gray-400 leading-relaxed">Manage documents, activate Lost Mode beacon, and stay safe with our zero-subscription platform.</p>
        </FadeIn>
      </div>

      {/* Official Brand Vehicle Pipeline Banner */}
      <div className="mb-20">
        <VehicleBanner
          headlinePrefix="YOUR VEHICLE."
          headlineHighlight="YOUR NETWORK."
          tagline="Your Vehicle. Your Network."
          defaultVehicle="car"
        />
      </div>

      {/* CTA Box */}
      <FadeIn delay={0.4} className="text-center">
        <div className="bg-gradient-to-r from-blue-900/30 via-cyan-900/20 to-black border border-cyan-500/30 rounded-3xl p-8 max-w-2xl mx-auto shadow-xl">
          <h3 className="text-2xl font-bold text-white mb-3 font-heading">Ready to get your tag?</h3>
          <p className="text-gray-400 text-sm mb-6">Order your official Vyra Smart Tag today. Dispatched within 24 hours with free shipping.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/buy" 
              className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 text-white font-extrabold px-8 py-3.5 rounded-full flex items-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:scale-105 transition"
            >
              <ShoppingCart className="w-4 h-4" />
              Order Tag (From ₹399)
            </Link>
            <Link 
              href="/scan-qr" 
              className="bg-white/10 text-white font-semibold px-6 py-3.5 rounded-full hover:bg-white/20 transition flex items-center gap-2"
            >
              <QrCode className="w-4 h-4 text-cyan-400" />
              Try QR Scanner
            </Link>
          </div>
        </div>
      </FadeIn>
    </main>
  );
}
