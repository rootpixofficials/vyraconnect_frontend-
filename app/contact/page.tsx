"use client";

import { HelpCircle, Mail, MapPin, Phone, MessageSquare, Package, QrCode } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import FadeIn from "@/components/FadeIn";
import Link from "next/link";

export default function SupportPage() {
  const faqs = [
    { 
      q: "How do I activate my Vyra Tag?", 
      a: "Scan your new sticker with any smartphone camera. The activation page will open automatically. Enter your name, mobile, and vehicle registration number to link it in under 60 seconds." 
    },
    { 
      q: "Can anyone who scans see my personal phone number?", 
      a: "No. Your phone number is never exposed. Scanners connect with you through private notifications and our 2-way masked call relay." 
    },
    { 
      q: "Are there any monthly subscription charges?", 
      a: "None. Your Vyra Smart Tag comes with lifetime platform access with zero monthly fees or recurring costs." 
    },
    { 
      q: "What if I change my vehicle or phone number?", 
      a: "You can update your linked phone number, emergency contacts, or vehicle details at any time from your account." 
    },
    { 
      q: "How long does shipping take?", 
      a: "All orders are dispatched within 24 hours from Vettichira, Kerala via express courier. Delivery typically takes 2 to 4 business days across India." 
    }
  ];

  return (
    <main className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      
      {/* Header */}
      <FadeIn className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-3">
          Customer Support &amp; Help Desk
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white font-heading tracking-tight mb-3">
          How can we help?
        </h1>
        <p className="text-gray-400 text-base">
          Find answers, get assistance with your order, or reach out to our team directly.
        </p>
      </FadeIn>

      {/* Quick Help Categories */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        
        {/* Category 1: Order Help */}
        <FadeIn delay={0.1}>
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 hover:bg-white/[0.06] transition-all text-left">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1.5">Order &amp; Delivery</h3>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4">
              Need tracking information or changes to your delivery address?
            </p>
            <a 
              href="https://wa.me/919746910890?text=Hi%20Vyra%20Connect%2C%20I%20need%20help%20with%20my%20order." 
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition inline-flex items-center gap-1"
            >
              <span>Chat with Order Support</span>
              <span>&rarr;</span>
            </a>
          </div>
        </FadeIn>

        {/* Category 2: Setup Help */}
        <FadeIn delay={0.2}>
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 hover:bg-white/[0.06] transition-all text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
              <QrCode className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1.5">Setup &amp; Activation</h3>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4">
              Quick guide to stick, scan, and activate your tag on your vehicle.
            </p>
            <Link 
              href="/how-it-works" 
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition inline-flex items-center gap-1"
            >
              <span>View Setup Instructions</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </FadeIn>

        {/* Category 3: Direct WhatsApp */}
        <FadeIn delay={0.3}>
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 hover:bg-white/[0.06] transition-all text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1.5">WhatsApp Support</h3>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4">
              Instant assistance via WhatsApp from Monday to Saturday (9am - 7pm).
            </p>
            <a 
              href="https://wa.me/919746910890?text=Hi%20Vyra%20Connect%2C%20I%20have%20an%20inquiry." 
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition inline-flex items-center gap-1"
            >
              <span>+91 97469 10890</span>
              <span>&rarr;</span>
            </a>
          </div>
        </FadeIn>

      </div>

      {/* Grid: FAQs (Left) & Contact Form / Details (Right) */}
      <div className="grid lg:grid-cols-12 gap-12 items-start mb-16">
        
        {/* Left: FAQs (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <FadeIn direction="right">
            <h2 className="text-2xl font-bold text-white font-heading mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3.5">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-black/40 border border-white/10 rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-white mb-2 flex items-start gap-2.5">
                    <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{faq.q}</span>
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm pl-6 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Right: Contact Information & Clean Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <FadeIn direction="left">
            
            {/* Contact Details Card */}
            <div className="bg-black/50 border border-white/10 rounded-3xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white font-heading">
                Contact Details
              </h3>
              
              <div className="space-y-3 text-xs sm:text-sm text-gray-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Location</strong>
                    <span className="text-gray-400">Vettichira, Kerala, India</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Phone &amp; WhatsApp</strong>
                    <a href="tel:+919746910890" className="text-gray-400 hover:text-cyan-400 transition">
                      +91 97469 10890
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Email</strong>
                    <a href="mailto:vyraconnect.in@gmail.com" className="text-gray-400 hover:text-cyan-400 transition">
                      vyraconnect.in@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Streamlined Message Form */}
            <div className="bg-black/50 border border-white/10 rounded-3xl p-6">
              <h3 className="text-base font-bold text-white mb-1">
                Send Us a Message
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                We will reply via email or WhatsApp within a few hours.
              </p>
              <ContactForm origin="Support Page" />
            </div>

          </FadeIn>
        </div>

      </div>

    </main>
  );
}
