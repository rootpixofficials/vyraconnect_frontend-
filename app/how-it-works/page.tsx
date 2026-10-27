"use client";

import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import { 
  Package, CheckCircle2, QrCode, PhoneOff, 
  HelpCircle, ShoppingCart, ArrowRight 
} from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Get your Vyra Tag",
      description: "Order your official Vyra Smart Tag kit online with free express delivery to your doorstep.",
      icon: Package
    },
    {
      number: "02",
      title: "Attach it to your vehicle",
      description: "Peel and stick the ultra-durable weatherproof tag on your vehicle windshield, window, or body.",
      icon: CheckCircle2
    },
    {
      number: "03",
      title: "Activate it",
      description: "Scan your tag once with your smartphone camera to link your vehicle details in under 60 seconds.",
      icon: QrCode
    },
    {
      number: "04",
      title: "Someone scans it",
      description: "Anyone who needs to contact you points their phone camera at the QR code. No special app required.",
      icon: QrCode
    },
    {
      number: "05",
      title: "You get contacted privately",
      description: "Connect via instant parking alerts or 2-way masked call without revealing your personal phone number.",
      icon: PhoneOff
    }
  ];

  const faqs = [
    {
      q: "Does the scanner see my phone number?",
      a: "No. Your phone number is 100% hidden. All calls and alerts are routed through our secure privacy relay."
    },
    {
      q: "Does the scanner need the Vyra app?",
      a: "No. Anyone can scan your tag directly using their standard smartphone camera or any QR reader app."
    },
    {
      q: "Is there a monthly fee?",
      a: "No. Your one-time purchase of ₹499 includes lifetime access with zero monthly subscriptions or hidden charges."
    },
    {
      q: "Does it work for cars and bikes?",
      a: "Yes. The Vyra kit is completely weatherproof and engineered for all cars, motorcycles, scooters, and commercial vehicles."
    }
  ];

  return (
    <main className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      
      {/* Header */}
      <FadeIn className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-3">
          Simple 5-Step Process
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white font-heading tracking-tight mb-4">
          How Vyra Works
        </h1>
        <p className="text-lg text-gray-300 leading-relaxed">
          From unboxing to full vehicle privacy protection in less than 2 minutes.
        </p>
      </FadeIn>

      {/* 5-Step Flow */}
      <div className="max-w-4xl mx-auto space-y-6 mb-20">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <FadeIn key={step.number} delay={idx * 0.08}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 bg-white/[0.03] border border-white/10 rounded-3xl p-6 sm:p-8 hover:bg-white/[0.06] transition-all">
                
                {/* Step Number Badge */}
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 font-mono font-black text-lg flex items-center justify-center border border-cyan-400/20 shrink-0">
                  {step.number}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1.5 font-heading">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Subtle Icon Indicator */}
                <div className="hidden sm:flex text-gray-500">
                  <Icon className="w-6 h-6" />
                </div>

              </div>
            </FadeIn>
          );
        })}
      </div>

      {/* Small Clean FAQ Section */}
      <div className="max-w-3xl mx-auto mb-20">
        <FadeIn className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-heading">
            Frequently Asked Questions
          </h2>
        </FadeIn>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
                <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-gray-400 text-sm pl-6 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <FadeIn delay={0.25} className="text-center">
        <div className="bg-gradient-to-r from-blue-900/30 via-cyan-900/20 to-black border border-cyan-500/30 rounded-3xl p-8 sm:p-12 max-w-2xl mx-auto shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 font-heading">
            Ready to protect your vehicle?
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Get your official Vyra Smart Tag with free express shipping across India.
          </p>
          <Link 
            href="/buy" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 text-white font-extrabold px-8 py-3.5 rounded-full shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:scale-105 transition"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Get Vyra &rarr;</span>
          </Link>
        </div>
      </FadeIn>

    </main>
  );
}
