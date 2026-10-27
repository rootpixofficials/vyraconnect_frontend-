"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, QrCode, ArrowRight } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Features", href: "/features" },
    { name: "Buy", href: "/buy" },
    { name: "Support", href: "/contact" },
  ];

  return (
    <nav 
      aria-label="Main Navigation"
      className={`fixed w-full z-50 top-0 transition-all duration-300 ${
        scrolled 
          ? "bg-[#060d18]/90 backdrop-blur-xl border-b border-white/10 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]" 
          : "bg-transparent border-b border-transparent py-4 sm:py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          
          {/* Brand Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link 
              href="/" 
              className="relative h-12 w-36 sm:h-14 sm:w-44 flex items-center transition-opacity hover:opacity-90"
              aria-label="Vyra Connect Home"
            >
              <Image 
                src="/vyra-logo-navbar.png" 
                alt="Vyra Connect" 
                fill 
                className="object-contain object-left" 
                priority 
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? "text-cyan-300 bg-white/5"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Scan QR Utility */}
            <Link
              href="/scan-qr"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold text-gray-300 hover:text-cyan-300 hover:bg-white/5 border border-transparent hover:border-white/10 transition"
            >
              <QrCode className="w-3.5 h-3.5 text-cyan-400" />
              <span>Scan QR</span>
            </Link>

            {/* Primary CTA */}
            <Link 
              href="/buy" 
              className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 text-white px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 border border-cyan-400/30"
            >
              <span>Get Vyra</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Toggle & Direct Action */}
          <div className="flex md:hidden items-center gap-2">
            <Link 
              href="/buy" 
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md"
            >
              Get Vyra
            </Link>
            
            <button 
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#060d18]/98 backdrop-blur-2xl border-b border-white/10 px-6 py-6 space-y-3 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name}
                href={link.href} 
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-base font-semibold py-2 px-3 rounded-xl transition ${
                  isActive
                    ? "text-cyan-300 bg-white/5"
                    : "text-gray-200 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <Link 
              href="/scan-qr" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 text-gray-300 bg-white/5 border border-white/10 py-3 rounded-xl text-sm font-semibold hover:text-white"
            >
              <QrCode className="w-4 h-4 text-cyan-400" />
              <span>Scan QR Tag</span>
            </Link>

            <Link 
              href="/buy" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 text-white py-3.5 rounded-xl text-sm font-bold shadow-lg"
            >
              <span>Get Vyra Tag — ₹499</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
