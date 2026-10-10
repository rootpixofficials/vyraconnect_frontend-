"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    // Check initial scroll position
    handleScroll();
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 top-0 transition-all duration-300 ${
      scrolled ? "bg-[#0a1526]/90 backdrop-blur-xl border-b border-white/10 py-0" : "bg-transparent border-b border-transparent py-2"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="relative w-48 h-20 flex items-center justify-center overflow-hidden">
              <Image src="/logo-transparent.png" alt="Vyra Connect" fill className="object-contain" priority />
            </Link>
          </div>
          <div className="hidden md:flex space-x-8 text-sm font-medium">
            <Link href="/" className="text-white hover:text-blue-400 transition-colors">Home</Link>
            <Link href="/about" className="text-gray-300 hover:text-blue-400 transition-colors">About</Link>
            <Link href="/features" className="text-gray-300 hover:text-blue-400 transition-colors">Features</Link>
            <Link href="/how-it-works" className="text-gray-300 hover:text-blue-400 transition-colors">How It Works</Link>
            <Link href="/scan-qr" className="text-gray-300 hover:text-blue-400 transition-colors">Scan QR</Link>
            <Link href="/contact" className="text-gray-300 hover:text-blue-400 transition-colors">Contact</Link>
          </div>
          <div className="hidden md:flex items-center">
            <Link href="/buy" className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Get Vyra
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
