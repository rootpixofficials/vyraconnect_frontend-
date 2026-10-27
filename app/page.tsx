"use client";

import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import { 
  ShieldCheck, PhoneOff, Bell, Car, QrCode, ArrowRight, 
  FileText, Users, ShoppingCart, Check, Sparkles 
} from "lucide-react";

export default function Home() {
  return (
    <main className="relative overflow-hidden selection:bg-cyan-500 selection:text-black">
      
      {/* Ambient Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-cyan-600/10 via-blue-900/10 to-transparent blur-[140px] pointer-events-none -z-10" />

      {/* =========================================================================
          SECTION 1: HERO
          Clear, powerful hero. Immediate 5-second understanding.
          ========================================================================= */}
      <section className="pt-8 sm:pt-14 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left: Message & Primary Action (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <FadeIn>
              
              {/* Product Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-cyan-300 text-xs font-medium tracking-wide mb-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Smart Vehicle Privacy Tag</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl xl:text-[4.25rem] font-black text-white tracking-tight font-heading leading-[1.08] mb-4">
                Your Vehicle. <br />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                  Your Privacy.
                </span>
              </h1>

              {/* Simple Value Proposition */}
              <p className="text-lg sm:text-xl text-gray-300 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
                Let anyone contact you through your vehicle without revealing your personal phone number.
              </p>

              {/* Price / Offer Highlight */}
              <div className="flex items-center justify-center lg:justify-start gap-3 pt-1 text-sm">
                <span className="text-xs uppercase tracking-wider text-gray-400 font-mono">Special Offer:</span>
                <span className="text-2xl font-black text-white">₹499</span>
                <span className="text-base text-gray-500 line-through">₹799</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Save ₹300
                </span>
              </div>

              {/* Primary Call to Actions */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                <Link 
                  href="/buy" 
                  className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 text-white px-8 py-4 rounded-full font-extrabold text-base hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-cyan-400/30 shadow-lg"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Get Vyra</span>
                </Link>

                <Link 
                  href="/how-it-works" 
                  className="bg-white/5 border border-white/10 hover:border-white/20 text-white px-7 py-4 rounded-full font-semibold text-base hover:bg-white/10 transition-all flex items-center gap-2"
                >
                  <span>See How It Works</span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </Link>
              </div>

              {/* Micro-reassurance */}
              <p className="text-xs text-gray-400 pt-2 font-mono">
                No monthly subscriptions &bull; 100% number masking &bull; Free express delivery across India
              </p>
            </FadeIn>
          </div>

          {/* Right: The Actual Vyra Product Card Visual (5 cols) */}
          <div className="lg:col-span-5 flex justify-center">
            <FadeIn delay={0.15} className="w-full max-w-md">
              <div className="relative group">
                
                {/* Subtle Back Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-[2.5rem] blur-2xl group-hover:blur-3xl transition-all opacity-80" />
                
                {/* Product Card Container */}
                <div className="relative rounded-[2.5rem] bg-gradient-to-b from-white/10 via-black/40 to-black/80 border border-white/15 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
                  
                  {/* Clean Visual of the Real Vyra Smart Tag Card */}
                  <div className="relative w-full aspect-[1024/646] rounded-2xl overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                    <Image 
                      src="/images/vyra-tag-card.webp" 
                      alt="Vyra Connect Smart QR Tag" 
                      fill 
                      className="object-contain"
                      priority 
                    />
                  </div>

                  {/* Product Caption Bar */}
                  <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-300">
                    <span className="font-semibold text-white">Vyra Smart Tag Kit</span>
                    <span className="text-cyan-300 font-mono font-medium">1 Scan &bull; 100% Private</span>
                  </div>
                </div>

              </div>
            </FadeIn>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 2: WHAT IS VYRA?
          One scan. Private connection.
          ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <FadeIn>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-heading tracking-tight mb-4">
              One scan. Private connection.
            </h2>
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
              Put a Vyra QR tag on your vehicle. Anyone who needs to reach you can scan it and contact you privately.
            </p>
          </FadeIn>
        </div>

        {/* 3 Simple Benefits */}
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Benefit 1 */}
          <FadeIn delay={0.1}>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/[0.07] transition-all h-full">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-6 border border-cyan-400/20">
                <PhoneOff className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">1. Private Contact</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your personal phone number stays hidden. Callers connect through our secure privacy relay.
              </p>
            </div>
          </FadeIn>

          {/* Benefit 2 */}
          <FadeIn delay={0.2}>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/[0.07] transition-all h-full">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-6 border border-blue-400/20">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">2. Instant Alerts</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Know immediately when someone needs to reach you for parking issues, emergencies, or assistance.
              </p>
            </div>
          </FadeIn>

          {/* Benefit 3 */}
          <FadeIn delay={0.3}>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/[0.07] transition-all h-full">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6 border border-emerald-400/20">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">3. Works With Your Vehicle</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Simple, weatherproof protection designed for cars, bikes, scooters, and commercial fleets.
              </p>
            </div>
          </FadeIn>

        </div>
      </section>

      {/* =========================================================================
          SECTION 3: HOW IT WORKS
          Clean 3-step flow: Vehicle -> Scan QR -> Contact Owner
          ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <FadeIn>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-heading tracking-tight mb-4">
              How Vyra Works
            </h2>
            <p className="text-gray-400 text-base sm:text-lg">
              Simple 3-step setup. No technical knowledge required.
            </p>
          </FadeIn>
        </div>

        {/* 3 Step Flow */}
        <div className="grid md:grid-cols-3 gap-8 relative mb-12">
          
          {/* Step 1 */}
          <FadeIn delay={0.1}>
            <div className="bg-black/40 border border-white/10 rounded-3xl p-8 relative h-full">
              <span className="text-3xl font-black font-mono text-cyan-400/60 block mb-4">01</span>
              <h3 className="text-xl font-bold text-white mb-2">Attach</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Place your weatherproof Vyra QR tag on your vehicle windshield, window, or body.
              </p>
            </div>
          </FadeIn>

          {/* Step 2 */}
          <FadeIn delay={0.2}>
            <div className="bg-black/40 border border-white/10 rounded-3xl p-8 relative h-full">
              <span className="text-3xl font-black font-mono text-cyan-400/60 block mb-4">02</span>
              <h3 className="text-xl font-bold text-white mb-2">Scan</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Anyone who needs to reach you simply scans the QR code with any smartphone camera.
              </p>
            </div>
          </FadeIn>

          {/* Step 3 */}
          <FadeIn delay={0.3}>
            <div className="bg-black/40 border border-white/10 rounded-3xl p-8 relative h-full">
              <span className="text-3xl font-black font-mono text-cyan-400/60 block mb-4">03</span>
              <h3 className="text-xl font-bold text-white mb-2">Connect</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                They contact you privately through our masked relay without ever seeing your phone number.
              </p>
            </div>
          </FadeIn>

        </div>

        {/* Visual Flow Banner & Link */}
        <FadeIn delay={0.35} className="text-center">
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-full text-xs sm:text-sm font-mono text-gray-300 mb-6">
            <span className="text-white font-bold">Vehicle</span>
            <span className="text-cyan-400">&rarr;</span>
            <span className="text-white font-bold">Scan QR</span>
            <span className="text-cyan-400">&rarr;</span>
            <span className="text-cyan-300 font-bold">Contact Owner Privately</span>
          </div>

          <div>
            <Link 
              href="/how-it-works"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition"
            >
              <span>See Full How It Works Guide</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* =========================================================================
          SECTION 4: CORE FEATURES
          Everything you need. Nothing complicated. (4 key features only)
          ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <FadeIn>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-heading tracking-tight mb-4">
              Everything you need. <br />
              <span className="text-gray-400">Nothing complicated.</span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg">
              Smart vehicle safety features built for everyday peace of mind.
            </p>
          </FadeIn>
        </div>

        {/* 4 Core Features */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          {/* Feature 1 */}
          <FadeIn delay={0.1}>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-7 hover:bg-white/[0.08] transition-all h-full">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-5">
                <PhoneOff className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Private Contact</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Communicate effortlessly without exposing your personal phone number.
              </p>
            </div>
          </FadeIn>

          {/* Feature 2 */}
          <FadeIn delay={0.2}>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-7 hover:bg-white/[0.08] transition-all h-full">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Lost Mode</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Help people reach you when your vehicle needs assistance, parking relocation, or recovery.
              </p>
            </div>
          </FadeIn>

          {/* Feature 3 */}
          <FadeIn delay={0.3}>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-7 hover:bg-white/[0.08] transition-all h-full">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-5">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Vehicle Documents</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Keep important vehicle documents like RC and insurance securely organised in one place.
              </p>
            </div>
          </FadeIn>

          {/* Feature 4 */}
          <FadeIn delay={0.4}>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-7 hover:bg-white/[0.08] transition-all h-full">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Multiple Vehicles</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Manage all your family cars, motorcycles, and vehicles conveniently from one account.
              </p>
            </div>
          </FadeIn>

        </div>

        {/* Explore All Features Link */}
        <FadeIn delay={0.45} className="text-center">
          <Link 
            href="/features"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition"
          >
            <span>Explore All Features</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </FadeIn>
      </section>

      {/* =========================================================================
          SECTION 5: PRODUCT / BUY PREVIEW
          Make the actual Vyra product the hero visually.
          ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-white/5">
        <FadeIn>
          <div className="rounded-[2.5rem] bg-gradient-to-b from-white/10 via-black/50 to-black/80 border border-white/15 p-8 sm:p-12 backdrop-blur-xl shadow-2xl">
            <div className="grid md:grid-cols-12 gap-8 items-center">
              
              {/* Product Visual */}
              <div className="md:col-span-6 flex justify-center">
                <div className="relative w-full max-w-sm aspect-[1024/646] rounded-2xl overflow-hidden shadow-2xl">
                  <Image 
                    src="/images/vyra-tag-card.webp" 
                    alt="Vyra Smart Tag Kit" 
                    fill 
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Package Details */}
              <div className="md:col-span-6 space-y-5">
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">Complete Hardware Package</span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading mt-1">
                    Vyra Smart Tag Kit
                  </h3>
                </div>

                {/* Pricing */}
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black text-white">₹499</span>
                  <span className="text-lg text-gray-500 line-through">₹799</span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/30">
                    Offer Price
                  </span>
                </div>

                {/* Short Package List */}
                <ul className="space-y-2.5 text-sm text-gray-300">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Weatherproof QR Smart Sticker</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Keyring Scanner Tag</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Vehicle ID Card</span>
                  </li>
                  <li className="flex items-center gap-2.5 font-semibold text-white">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Lifetime Access &bull; No monthly subscription</span>
                  </li>
                </ul>

                {/* CTA */}
                <div className="pt-2">
                  <Link 
                    href="/buy" 
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 text-white font-bold px-8 py-4 rounded-full shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-wider"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Get Vyra Kit</span>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </FadeIn>
      </section>

      {/* =========================================================================
          SECTION 6: MINIMAL TRUST SECTION
          Genuine, clean trust points without invented claims.
          ========================================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-white/5 text-center">
        <FadeIn>
          <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-gray-400 mb-8">
            Trusted by vehicle owners across India
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
              <span className="text-xl font-bold text-white block mb-1">100% Private</span>
              <p className="text-xs text-gray-400">Zero phone number exposure during scans</p>
            </div>

            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
              <span className="text-xl font-bold text-white block mb-1">Zero Subscription</span>
              <p className="text-xs text-gray-400">One-time purchase with lifetime access</p>
            </div>

            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
              <span className="text-xl font-bold text-white block mb-1">Express Delivery</span>
              <p className="text-xs text-gray-400">Dispatched from Vettichira, Kerala</p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* =========================================================================
          SECTION 7: FINAL CTA
          Ready to make your vehicle smarter?
          ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <FadeIn>
          <div className="relative rounded-[2.5rem] bg-gradient-to-r from-blue-900/40 via-cyan-900/30 to-black border border-cyan-500/30 p-10 sm:p-14 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading tracking-tight mb-3">
              Ready to make your vehicle smarter?
            </h2>
            <p className="text-gray-300 text-base sm:text-lg max-w-xl mx-auto mb-8">
              Stay reachable while keeping your personal number private.
            </p>
            
            <Link 
              href="/buy" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 text-white font-extrabold px-9 py-4 rounded-full text-base shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:scale-105 active:scale-95 transition-all"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Get Vyra — ₹499</span>
            </Link>
          </div>
        </FadeIn>
      </section>

    </main>
  );
}
