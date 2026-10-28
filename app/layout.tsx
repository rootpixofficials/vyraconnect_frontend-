import type { Metadata } from "next";
import { Inter, Syncopate } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import { FaEnvelope, FaInstagram, FaWhatsapp, FaFacebookF, FaYoutube } from "react-icons/fa";
import GlobalWrapper from "@/components/GlobalWrapper";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const headingFont = Syncopate({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-heading" });

export const metadata: Metadata = {
  title: "Vyra Connect | Your Vehicle. Your Privacy.",
  description: "Put Vyra on your vehicle. If someone needs to contact you, they scan it and can reach you without seeing your personal phone number.",
  keywords: ["vehicle privacy", "smart qr tag", "car qr code", "bike privacy tag", "private parking call", "vyra connect"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const footerContent = (
    <footer className="bg-[#040810] pt-16 pb-10 border-t border-white/10 backdrop-blur-lg mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-block relative h-10 w-36 sm:h-12 sm:w-44">
              <Image 
                src="/vyra-logo-navbar.png" 
                alt="Vyra Connect" 
                fill 
                className="object-contain object-left" 
                priority 
              />
            </Link>
            
            <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
              Put Vyra on your vehicle. Anyone who needs to reach you can scan it and contact you privately — without seeing your phone number.
            </p>

            <div className="pt-2 text-xs text-gray-400 space-y-1.5 font-mono">
              <p className="text-gray-300 font-sans font-medium">📍 Vettichira, Kerala, India</p>
              <p>📞 Phone & WhatsApp: <a href="tel:+919746910890" className="hover:text-cyan-400 transition">+91 97469 10890</a></p>
              <p>✉️ Email: <a href="mailto:vyraconnect.in@gmail.com" className="hover:text-cyan-400 transition">vyraconnect.in@gmail.com</a></p>
            </div>
          </div>
          
          {/* Product Links (3 cols) */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-mono">
              Product
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link href="/how-it-works" className="hover:text-white transition">How It Works</Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-white transition">Features</Link>
              </li>
              <li>
                <Link href="/buy" className="hover:text-cyan-400 font-semibold text-cyan-300 transition">
                  Get Vyra Tag
                </Link>
              </li>
              <li>
                <Link href="/scan-qr" className="hover:text-white transition">Scan QR</Link>
              </li>
            </ul>
          </div>
          
          {/* Support (2 cols) */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-mono">
              Support
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link href="/contact" className="hover:text-white transition">Support & FAQ</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">Order Help</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal (2 cols) */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-mono">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link href="/about" className="hover:text-white transition">About</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="hover:text-white transition">Terms & Conditions</Link>
              </li>
            </ul>
          </div>

        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <p>&copy; {new Date().getFullYear()} Vyra Connect. All rights reserved. Vettichira, Kerala.</p>
          
          <div className="flex items-center gap-4 text-gray-400">
            <a href="https://wa.me/919746910890" target="_blank" rel="noopener noreferrer" title="WhatsApp" className="hover:text-cyan-400 transition">
              <FaWhatsapp className="w-4 h-4" />
            </a>
            <a href="mailto:vyraconnect.in@gmail.com" title="Email" className="hover:text-cyan-400 transition">
              <FaEnvelope className="w-4 h-4" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram" className="hover:text-cyan-400 transition">
              <FaInstagram className="w-4 h-4" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" title="YouTube" className="hover:text-cyan-400 transition">
              <FaYoutube className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );

  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${headingFont.variable} font-sans bg-[linear-gradient(135deg,#060d18_0%,#0a1526_50%,#040914_100%)] text-gray-200 antialiased min-h-screen selection:bg-cyan-500 selection:text-black flex flex-col`}>
        <GlobalWrapper footer={footerContent}>
          {children}
        </GlobalWrapper>
      </body>
    </html>
  );
}
