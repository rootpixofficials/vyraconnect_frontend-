"use client";

import Link from "next/link";
import { Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function FloatingContact() {
  const phoneNumber = "+91 97469 10890";
  const whatsappUrl = "https://wa.me/919746910890?text=Hi%20Vyra%20Connect%2C%20I%20have%20an%20inquiry.";
  const callUrl = "tel:+919746910890";

  return (
    <aside aria-label="Quick contact" className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2 select-none font-sans">
      
      {/* WhatsApp Button */}
      <Link
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat on WhatsApp with Vyra Connect at ${phoneNumber}`}
        className="group flex items-center gap-2 bg-[#06140e]/95 hover:bg-[#082017] border border-emerald-500/50 hover:border-emerald-400 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full shadow-[0_4px_25px_rgba(16,185,129,0.35)] hover:shadow-[0_6px_30px_rgba(16,185,129,0.55)] transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-xl"
      >
        <div className="relative flex items-center justify-center">
          <FaWhatsapp className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute -top-0.5 -right-0.5" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 font-bold leading-none">
            WhatsApp Online
          </span>
          <span className="text-xs font-extrabold text-white font-mono tracking-wide mt-0.5">
            {phoneNumber}
          </span>
        </div>
      </Link>

      {/* Call Vyra Button */}
      <Link
        href={callUrl}
        aria-label={`Call Vyra Connect at ${phoneNumber}`}
        className="group flex items-center gap-2 bg-[#040c18]/95 hover:bg-[#07162b] border border-cyan-500/50 hover:border-cyan-400 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full shadow-[0_4px_25px_rgba(6,182,212,0.35)] hover:shadow-[0_6px_30px_rgba(6,182,212,0.55)] transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-xl"
      >
        <div className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-400/30 group-hover:bg-cyan-500/30 transition-colors">
          <Phone className="w-3.5 h-3.5 text-cyan-300 group-hover:rotate-12 transition-transform" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-400 font-bold leading-none">
            Call Vyra
          </span>
          <span className="text-xs font-extrabold text-white font-mono tracking-wide mt-0.5">
            {phoneNumber}
          </span>
        </div>
      </Link>

    </aside>
  );
}
