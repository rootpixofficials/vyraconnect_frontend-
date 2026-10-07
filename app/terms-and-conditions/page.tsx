"use client";

import FadeIn from "@/components/FadeIn";

export default function TermsAndConditions() {
  return (
    <main className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto overflow-hidden">
      <FadeIn className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4 font-heading">Terms & Conditions</h1>
        <p className="text-gray-400">Last updated: October 2026</p>
      </FadeIn>

      <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-3xl space-y-10 text-gray-300 shadow-2xl">
        <FadeIn delay={0.1} direction="up">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-heading">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">
              By accessing and using the Vyra Connect platform (website, mobile application, and physical QR tags), you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>
        </FadeIn>
        
        <FadeIn delay={0.2} direction="up">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-heading">2. Privacy & Data Protection</h2>
            <p className="leading-relaxed">
              Vyra Connect routes communications privately. We are committed to protecting your privacy and do not expose personal phone numbers to scanners. You agree to use the platform responsibly and not for spam, harassment, or illegal activities.
            </p>
          </section>
        </FadeIn>
        
        <FadeIn delay={0.3} direction="up">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-heading">3. Vyra Tag Usage</h2>
            <p className="leading-relaxed">
              Physical Vyra Tags remain the property of the purchaser after delivery. You are entirely responsible for the safe and legal placement of the tag on your vehicle, ensuring it does not obstruct driver visibility or violate local laws.
            </p>
          </section>
        </FadeIn>

        <FadeIn delay={0.4} direction="up">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-heading">4. User Accounts</h2>
            <p className="leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Vyra Connect reserves the right to suspend or terminate accounts that violate our usage policies.
            </p>
          </section>
        </FadeIn>
        
        <FadeIn delay={0.5} direction="up">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-heading">5. Limitation of Liability</h2>
            <p className="leading-relaxed">
              Vyra Connect is a communication utility. We are not liable for any damages, theft, or losses related to your vehicle or your use of our services. We do not guarantee the recovery of lost vehicles and act solely as a private communication bridge.
            </p>
          </section>
        </FadeIn>
      </div>
    </main>
  );
}
