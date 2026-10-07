"use client";

import { ShieldCheck, Smartphone, ShoppingCart } from "lucide-react";
import FadeIn from "@/components/FadeIn";

export default function About() {
  return (
    <main className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      <div className="max-w-3xl mx-auto text-center">
        <FadeIn>
          <h1 className="text-4xl font-bold text-white mb-6 font-heading">About Vyra Connect</h1>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            Vyra Connect is a smart vehicle identification and private communication platform. Physical QR tags connect scanners to owners—without exposing personal phone numbers.
          </p>
        </FadeIn>
        
        <ul className="text-left text-gray-300 space-y-6 max-w-2xl mx-auto mb-12">
          <FadeIn delay={0.1} direction="left">
            <li className="flex items-start gap-4 bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-colors">
              <ShieldCheck className="w-8 h-8 text-blue-500 shrink-0" />
              <span className="leading-relaxed">Scan a Vyra Tag or plate to notify, chat, SMS, or call the owner privately.</span>
            </li>
          </FadeIn>
          <FadeIn delay={0.2} direction="left">
            <li className="flex items-start gap-4 bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-colors">
              <Smartphone className="w-8 h-8 text-blue-500 shrink-0" />
              <span className="leading-relaxed">Owners manage vehicles, documents, family access, Live Status, and Lost Mode in the app.</span>
            </li>
          </FadeIn>
          <FadeIn delay={0.3} direction="left">
            <li className="flex items-start gap-4 bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-colors">
              <ShoppingCart className="w-8 h-8 text-blue-500 shrink-0" />
              <span className="leading-relaxed">Activate on web or in-app, order tags online, and stay protected with privacy-first channels.</span>
            </li>
          </FadeIn>
        </ul>
        
        <FadeIn delay={0.4} direction="up">
          <p className="text-gray-300 bg-blue-900/20 p-6 rounded-xl border border-blue-500/20 leading-relaxed shadow-[0_0_30px_rgba(37,99,235,0.1)]">
            Available on Google Play and the App Store. Use the website to find a vehicle, activate a new QR, or buy a Vyra Tag—then manage everything from the mobile app.
          </p>
        </FadeIn>
      </div>
    </main>
  );
}
