"use client";

import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import { ShieldCheck, MapPin, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto overflow-hidden">
      
      {/* Brand Mission Statement */}
      <FadeIn className="text-center space-y-6">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-2">
          About Vyra Connect
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white font-heading tracking-tight leading-tight max-w-2xl mx-auto">
          Making vehicle communication simpler and more private.
        </h1>

        <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
          Vyra Connect helps vehicle owners stay reachable without publicly displaying their personal phone number on their car or bike.
        </p>

      </FadeIn>

      {/* Our Goal: Simple. Private. Connected. */}
      <div className="my-16">
        <FadeIn delay={0.15}>
          <div className="rounded-3xl bg-white/[0.03] border border-white/10 p-8 sm:p-12 text-center">
            
            <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold mb-6">
              Our Goal
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
              
              <div className="space-y-2">
                <span className="text-2xl font-black text-white block font-heading">Simple.</span>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Zero apps required for scanners. Instant connection in seconds.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-2xl font-black text-white block font-heading">Private.</span>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Your personal phone number is never exposed to strangers.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-2xl font-black text-white block font-heading">Connected.</span>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Stay reachable for parking alerts, emergencies, and safety.
                </p>
              </div>

            </div>

            <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-center gap-2 text-xs text-gray-400 font-mono">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>Headquartered in Vettichira, Kerala, India</span>
            </div>

          </div>
        </FadeIn>
      </div>

      {/* Navigation Return */}
      <FadeIn delay={0.25} className="text-center">
        <Link 
          href="/how-it-works"
          className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition"
        >
          <span>See How Vyra Connect Works</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </FadeIn>

    </main>
  );
}
