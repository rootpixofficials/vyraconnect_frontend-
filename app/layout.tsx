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
  title: "Vyra Connect | Smart Vehicle Identification Platform",
  description: "Vyra Connect is a smart vehicle identification and private communication platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const footerContent = (
    <footer className="bg-black/60 pt-20 pb-10 border-t border-white/10 backdrop-blur-lg mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-72 h-28 relative">
                 <Image src="/logo-transparent.png" alt="Vyra Connect" fill className="object-contain object-left" priority />
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Smart Vehicle Identification Platform. Activate your tag, get private notifications when someone scans, enable Lost Mode when needed.
            </p>
            <div className="space-y-4 text-gray-400">
              <p>Calicut, Kerala, India</p>
              <p>Phone: +91 7907965255</p>
              <p>Email: support@vyraconnect.com</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-6">Useful Links</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/" className="hover:text-blue-400 transition">Home</Link></li>
              <li><Link href="/about" className="hover:text-blue-400 transition">About Vyra Connect</Link></li>
              <li><Link href="/how-it-works" className="hover:text-blue-400 transition">How It Works</Link></li>
              <li><Link href="/scan-qr" className="hover:text-blue-400 transition">Scan QR</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400 transition">Contact & FAQ</Link></li>
            </ul>
          </div>
          
          <div className="flex flex-col h-full">
            <div>
              <h4 className="font-bold text-white mb-6">Our Features</h4>
              <ul className="space-y-3 text-gray-400 mb-6">
                <li>Private QR contact</li>
                <li>Lost Mode recovery</li>
                <li>Masked chat / SMS / voice</li>
                <li>Vehicle document locker</li>
              </ul>
            </div>
            <div className="mt-auto flex gap-6">
              <Link href="#" title="Email" className="text-gray-400 hover:text-blue-400 transition-all duration-300 hover:scale-125 hover:-translate-y-1 hover:drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]">
                <FaEnvelope className="w-5 h-5" />
              </Link>
              <Link href="#" title="Instagram" className="text-gray-400 hover:text-blue-400 transition-all duration-300 hover:scale-125 hover:-translate-y-1 hover:drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]">
                <FaInstagram className="w-5 h-5" />
              </Link>
              <Link href="#" title="WhatsApp" className="text-gray-400 hover:text-blue-400 transition-all duration-300 hover:scale-125 hover:-translate-y-1 hover:drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]">
                <FaWhatsapp className="w-5 h-5" />
              </Link>
              <Link href="#" title="Facebook" className="text-gray-400 hover:text-blue-400 transition-all duration-300 hover:scale-125 hover:-translate-y-1 hover:drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]">
                <FaFacebookF className="w-5 h-5" />
              </Link>
              <Link href="#" title="YouTube" className="text-gray-400 hover:text-blue-400 transition-all duration-300 hover:scale-125 hover:-translate-y-1 hover:drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]">
                <FaYoutube className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>Ac {new Date().getFullYear()} Vyra Connect. All Rights Reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-white transition">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );

  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${headingFont.variable} font-sans bg-[linear-gradient(135deg,#060d18_0%,#0a1526_50%,#040914_100%)] text-gray-200 antialiased min-h-screen selection:bg-blue-600 selection:text-white flex flex-col`}>
        <GlobalWrapper footer={footerContent}>
          {children}
        </GlobalWrapper>
      </body>
    </html>
  );
}
