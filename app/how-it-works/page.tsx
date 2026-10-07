"use client";

import { MessageSquare, ShieldCheck } from "lucide-react";
import DummyQR from "@/components/DummyQR";
import FadeIn from "@/components/FadeIn";

export default function HowItWorks() {
  return (
    <main className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      <FadeIn className="text-center mb-16">
        <h1 className="text-4xl font-bold text-white mb-4 font-heading">How Vyra Connect Works</h1>
        <p className="text-xl text-gray-400">One QR code. Smart, secure vehicle communication.</p>
      </FadeIn>

      <div className="grid md:grid-cols-3 gap-8 text-center relative">
        <FadeIn delay={0.1} direction="right" className="bg-white/5 backdrop-blur-md p-10 rounded-[3rem] border border-white/10 shadow-lg relative">
          <div className="w-20 h-20 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/30">
            <DummyQR className="w-12 h-12 p-1" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4 font-heading">1. Scan</h3>
          <p className="text-gray-400 leading-relaxed">Scan any Vyra Tag QR sticker or look up a plate to initiate contact instantly.</p>
        </FadeIn>
        
        <FadeIn delay={0.2} direction="up" className="bg-white/5 backdrop-blur-md p-10 rounded-[3rem] border border-white/10 shadow-lg relative">
          <div className="w-20 h-20 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/30">
            <MessageSquare className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4 font-heading">2. Connect</h3>
          <p className="text-gray-400 leading-relaxed">Send notifications, chat, or use masked calls without exposing personal numbers.</p>
        </FadeIn>
        
        <FadeIn delay={0.3} direction="left" className="bg-white/5 backdrop-blur-md p-10 rounded-[3rem] border border-white/10 relative overflow-hidden shadow-lg">
           <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600 shadow-[0_0_15px_#2563eb]" />
          <div className="w-20 h-20 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/30">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4 font-heading">3. Protect</h3>
          <p className="text-gray-400 leading-relaxed">Manage docs, enable Lost Mode, and stay safe with our secure platform.</p>
        </FadeIn>
      </div>
    </main>
  );
}
