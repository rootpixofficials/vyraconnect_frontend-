"use client";

import FadeIn from "@/components/FadeIn";
import Link from "next/link";
import { ShieldCheck, Lock, EyeOff } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <main className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto overflow-hidden">
      <FadeIn className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-3">
          Privacy Policy
        </div>
        <h1 className="text-4xl font-bold text-white mb-4 font-heading">
          Your Privacy is Our Core Foundation
        </h1>
        <p className="text-gray-400 text-sm">Last updated: October 2026 &bull; Vettichira, Kerala, India</p>
      </FadeIn>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-3xl space-y-8 text-gray-300 shadow-2xl">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-cyan-400" />
            1. Zero Phone Number Exposure
          </h2>
          <p className="text-sm leading-relaxed text-gray-300">
            When someone scans your Vyra QR tag, your mobile number is never displayed on their screen. All phone communications are bridged through our encrypted virtual relay so that neither party sees the other&apos;s personal contact number.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
            <Lock className="w-5 h-5 text-cyan-400" />
            2. Information We Collect
          </h2>
          <p className="text-sm leading-relaxed text-gray-300">
            We collect only the minimum information required to operate your vehicle safety tag: your name, mobile number (for OTP verification and masked call routing), vehicle registration number, and optional emergency contact details.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            3. How We Use Your Data
          </h2>
          <p className="text-sm leading-relaxed text-gray-300">
            Your data is strictly used to deliver parking alerts, connect 2-way masked calls, and assist with vehicle safety. We do not sell, rent, or trade your personal information with third-party advertising networks.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white font-heading">
            4. Data Security &amp; Encryption
          </h2>
          <p className="text-sm leading-relaxed text-gray-300">
            All data transmitted between your device, the QR scanner, and our servers is secured using industry-standard TLS encryption. Stored records are protected in secured cloud databases with strict access controls.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white font-heading">
            5. Contact Us Regarding Privacy
          </h2>
          <p className="text-sm leading-relaxed text-gray-300">
            If you have questions about your privacy or wish to request data updates, please contact our privacy desk:
          </p>
          <div className="text-xs font-mono text-gray-400 bg-black/40 p-4 rounded-xl space-y-1">
            <p className="text-white font-bold">Vyra Connect Support Desk</p>
            <p>Location: Vettichira, Kerala, India</p>
            <p>Email: vyraconnect.in@gmail.com</p>
            <p>Phone: +91 97469 10890</p>
          </div>
        </section>
      </div>
    </main>
  );
}
