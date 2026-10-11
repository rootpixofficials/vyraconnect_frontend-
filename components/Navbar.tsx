"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, X, QrCode } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 top-0 transition-all duration-300 ${
      scrolled 
        ? "bg-[#060d18]/90 backdrop-blur-xl border-b border-white/10 py-1 shadow-[0_4px_30px_rgba(0,0,0,0.5)]" 
        : "bg-transparent border-b border-transparent py-3"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Brand Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="relative w-48 sm:w-56 h-12 flex items-center justify-start overflow-hidden">
              <Image 
                src="/logo-horizontal.png" 
                alt="Vyra Connect" 
                fill 
                className="object-contain object-left" 
                priority 
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-8 text-sm font-medium">
            <Link href="/" className="text-white hover:text-cyan-400 transition-colors">Home</Link>
            <Link href="/about" className="text-gray-300 hover:text-cyan-400 transition-colors">About</Link>
            <Link href="/features" className="text-gray-300 hover:text-cyan-400 transition-colors">Features</Link>
            <Link href="/how-it-works" className="text-gray-300 hover:text-cyan-400 transition-colors">How It Works</Link>
            <Link href="/scan-qr" className="text-gray-300 hover:text-cyan-400 transition-colors flex items-center gap-1.5">
              <QrCode className="w-3.5 h-3.5 text-cyan-400" />
              Scan QR
            </Link>
            <Link href="/contact" className="text-gray-300 hover:text-cyan-400 transition-colors">Contact</Link>
          </div>

          {/* Desktop CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <Link 
              href="/buy" 
              className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-cyan-400/30"
            >
              <ShoppingCart className="w-4 h-4" />
              Get Vyra
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link 
              href="/buy" 
              className="bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Buy
            </Link>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#060d18]/95 backdrop-blur-2xl border-b border-white/10 px-6 py-6 space-y-4 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <Link 
            href="/" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-white hover:text-cyan-400 text-base font-semibold py-1.5"
          >
            Home
          </Link>
          <Link 
            href="/about" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-300 hover:text-cyan-400 text-base font-semibold py-1.5"
          >
            About
          </Link>
          <Link 
            href="/features" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-300 hover:text-cyan-400 text-base font-semibold py-1.5"
          >
            Features
          </Link>
          <Link 
            href="/how-it-works" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-300 hover:text-cyan-400 text-base font-semibold py-1.5"
          >
            How It Works
          </Link>
          <Link 
            href="/scan-qr" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-300 hover:text-cyan-400 text-base font-semibold py-1.5"
          >
            Scan QR
          </Link>
          <Link 
            href="/contact" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-300 hover:text-cyan-400 text-base font-semibold py-1.5"
          >
            Contact
          </Link>
          <div className="pt-2">
            <Link 
              href="/buy" 
              onClick={() => setMobileMenuOpen(false)}
              className="w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 text-white py-3 rounded-full font-bold text-center flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
            >
              <ShoppingCart className="w-4 h-4" />
              Get Vyra Smart Tag
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
