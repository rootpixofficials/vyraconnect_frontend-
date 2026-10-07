"use client";

import Preloader from "@/components/Preloader";
import DummyQR from "@/components/DummyQR";
import FadeIn from "@/components/FadeIn";
import { 
  Bell, MessageSquare, PhoneOff, QrCode, CheckCircle2, 
  Star, ShieldCheck, Smartphone, ArrowRight, Car, MapPin, Mail
} from "lucide-react";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";

export default function Home() {
  return (
    <main>
      <Preloader />

      {/* Hero Section */}
      <section className="pt-10 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <FadeIn direction="right">
            <div className="inline-block border border-blue-500/30 bg-blue-500/10 text-blue-400 rounded-full px-4 py-1.5 text-sm font-semibold mb-6 tracking-wider">
              PRIVACY-FIRST VEHICLE CONTACT
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 tracking-tight font-heading">
              Vyra Connect
            </h1>
            <h2 className="text-2xl md:text-3xl text-gray-400 font-light mb-6">
              Park freely. <span className="text-blue-400 font-medium">Stay private.</span>
            </h2>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-xl">
              When someone needs to reach you, they scan your QR — you get the alert, they never see your phone number.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <span className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm backdrop-blur-sm">
                <PhoneOff className="w-4 h-4 text-blue-400" /> Number hidden
              </span>
              <span className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm backdrop-blur-sm">
                <Bell className="w-4 h-4 text-blue-400" /> Instant alert
              </span>
              <span className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm backdrop-blur-sm">
                <MessageSquare className="w-4 h-4 text-blue-400" /> Notify • Chat • Call
              </span>
            </div>

            <div className="flex gap-4">
              <Link href="/scan-qr" className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition flex items-center gap-2 shadow-lg shadow-white/10">
                <QrCode className="w-5 h-5" /> Scan QR
              </Link>
              <Link href="/buy" className="bg-transparent border border-gray-600 text-white px-8 py-3 rounded-full font-bold hover:bg-white/5 transition flex items-center gap-2">
                Buy Vyra Tag
              </Link>
            </div>
          </FadeIn>
          
          <FadeIn direction="left" delay={0.2} className="relative mt-12 lg:mt-0 flex justify-center">
            {/* iPhone 18 Pro Mockup */}
            <div className="relative w-[320px] h-[650px] bg-black rounded-[3.5rem] border-[12px] border-[#1a1a24] shadow-[0_0_50px_rgba(37,99,235,0.15)] overflow-hidden flex flex-col ring-1 ring-white/10">
              {/* Dynamic Island */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-8 bg-black rounded-full z-20 flex items-center justify-between px-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-900/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
              </div>
              
              {/* Screen Content */}
              <div className="flex-1 bg-gradient-to-b from-[#0a1526] to-black relative flex flex-col pt-24 px-6 pb-12">
                <div className="text-center mb-10">
                  <h3 className="text-white text-xl mb-2 tracking-widest font-heading">SCAN QR</h3>
                  <p className="text-gray-400 text-sm">Align QR code within the frame</p>
                </div>

                {/* Scanner Frame */}
                <div className="relative aspect-square w-full rounded-3xl border-2 border-blue-500/50 overflow-hidden bg-black/40 p-8 flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.2)]">
                  <DummyQR className="w-full h-full opacity-60" />
                  
                  {/* Scanning Line */}
                  <div className="absolute left-0 w-full h-1 bg-blue-400 shadow-[0_0_20px_4px_#3b82f6] animate-scan-line z-10" />
                </div>
                
                <div className="mt-auto text-center">
                  <div className="inline-flex items-center gap-2 bg-white/10 px-6 py-3 rounded-full text-white backdrop-blur-md border border-white/5">
                    <CheckCircle2 className="w-5 h-5 text-blue-400" />
                    <span className="font-semibold text-sm">Scanning...</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Brief About Section */}
      <section className="py-20 bg-black/20 border-y border-white/5 backdrop-blur-sm overflow-hidden">
        <FadeIn className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6 font-heading">About Vyra Connect</h2>
          <p className="text-gray-400 text-lg mb-8 max-w-3xl mx-auto">
            A smart vehicle identification and private communication platform. Connect scanners to owners without exposing personal phone numbers.
          </p>
          <Link href="/about" className="inline-flex items-center gap-2 text-blue-400 font-bold hover:text-blue-300 transition">
            Learn More <ArrowRight className="w-4 h-4" />
          </Link>
        </FadeIn>
      </section>

      {/* Brief Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <FadeIn className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4 font-heading">Core Features</h2>
        </FadeIn>
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <FadeIn delay={0.1}>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors h-full">
              <QrCode className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Private QR Contact</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Scan to reach the owner privately without revealing phone numbers.</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors h-full">
              <MapPin className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Lost Mode</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Mark a vehicle lost and collect community tips securely and instantly.</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors h-full">
              <Car className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Multi-vehicle Garage</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Add and manage multiple vehicles across your family from one account.</p>
            </div>
          </FadeIn>
        </div>
        <FadeIn delay={0.4} className="text-center">
          <Link href="/features" className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-400 px-6 py-3 rounded-full font-bold hover:bg-blue-600/30 transition border border-blue-500/20">
            View All Features
          </Link>
        </FadeIn>
      </section>

      {/* Brief How it Works Section */}
      <section className="py-20 bg-blue-900/10 border-y border-white/5 backdrop-blur-sm overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4 font-heading">How It Works</h2>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-8 text-center mb-10">
            <FadeIn delay={0.1}>
              <div className="w-20 h-20 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                <QrCode className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-white font-heading">1. Scan</h3>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="w-20 h-20 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                <MessageSquare className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-white font-heading">2. Connect</h3>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="w-20 h-20 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-white font-heading">3. Protect</h3>
            </FadeIn>
          </div>
          <FadeIn delay={0.4} className="text-center">
            <Link href="/how-it-works" className="inline-flex items-center gap-2 text-blue-400 font-bold hover:text-blue-300 transition">
              Detailed Guide <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Brief Contact Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <FadeIn>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full -z-10" />
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6 font-heading">Need Assistance?</h2>
                <p className="text-gray-400 mb-10 text-lg leading-relaxed">
                  Have questions about Vyra Connect or need help setting up your tag? Drop us a message, and our support team will get back to you immediately.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-4 bg-black/40 px-6 py-4 rounded-2xl border border-white/5 w-fit">
                    <MapPin className="w-6 h-6 text-blue-500 shrink-0" />
                    <div>
                      <div className="text-sm text-gray-400">Location</div>
                      <div className="text-white font-medium">Calicut, Kerala, India</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-black/40 px-6 py-4 rounded-2xl border border-white/5 w-fit">
                    <Mail className="w-6 h-6 text-blue-500 shrink-0" />
                    <div>
                      <div className="text-sm text-gray-400">Email</div>
                      <div className="text-white font-medium">support@vyraconnect.com</div>
                    </div>
                  </div>
                </div>
                
                <Link href="/contact" className="inline-flex items-center gap-2 text-blue-400 font-bold hover:text-blue-300 transition">
                  View Full Contact Map <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="bg-black/20 p-8 rounded-[2rem] border border-white/5 shadow-inner">
                <h3 className="text-xl font-bold text-white mb-6 font-heading">Send a Message</h3>
                <ContactForm />
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Stats Section */}
      <section className="py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <FadeIn delay={0.1}>
              <div className="text-4xl font-extrabold text-blue-500 mb-2 font-heading">1200+</div>
              <div className="text-gray-400 text-sm">Happy Users</div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="text-4xl font-extrabold text-blue-500 mb-2 font-heading">2500+</div>
              <div className="text-gray-400 text-sm">Issues Resolved</div>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="text-4xl font-extrabold text-blue-500 mb-2 font-heading">3000+</div>
              <div className="text-gray-400 text-sm">Support Hours</div>
            </FadeIn>
            <FadeIn delay={0.4}>
              <div className="text-4xl font-extrabold text-blue-500 mb-2 font-heading">50+</div>
              <div className="text-gray-400 text-sm">Team Members</div>
            </FadeIn>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 bg-black/20 border-y border-white/5 backdrop-blur-sm overflow-hidden">
        <FadeIn className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-white mb-12 font-heading">What Vyra Connect customers are saying</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-lg relative">
              <div className="flex text-yellow-500 mb-6">
                <Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" />
              </div>
              <p className="text-gray-300 mb-8 italic leading-relaxed">"Excellent app for every vehicle owner! Smart QR, secure communication, timely reminders, and an easy-to-use interface. Vyra Connect makes vehicle management simple and stress-free."</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white text-lg">V</div>
                <div>
                  <h4 className="font-bold text-white">Vyra User</h4>
                  <span className="text-sm text-gray-500">05 Aug 2026</span>
                </div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-lg relative">
              <div className="flex text-yellow-500 mb-6">
                <Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" />
              </div>
              <p className="text-gray-300 mb-8 italic leading-relaxed">"vyra tag is excellent. Set up was easy and I feel much safer parking my car in public lots now knowing someone can reach me easily."</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center font-bold text-white text-lg">H</div>
                <div>
                  <h4 className="font-bold text-white">hanenen</h4>
                  <span className="text-sm text-gray-500">05 Aug 2026</span>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>
    </main>
  );
}
