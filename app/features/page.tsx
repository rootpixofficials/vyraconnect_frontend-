"use client";

import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import { 
  PhoneOff, Bell, PhoneCall, ShieldCheck, AlertTriangle, 
  Sliders, Car, FileText, Users, ShoppingCart, ArrowRight 
} from "lucide-react";

export default function Features() {
  const featureCategories = [
    {
      category: "CONNECT",
      description: "Seamless, private communication whenever someone needs to reach you.",
      badgeColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
      items: [
        {
          title: "Private QR Contact",
          description: "Anyone can scan your vehicle tag to reach you privately without seeing your phone number.",
          icon: PhoneOff
        },
        {
          title: "Parking Alerts",
          description: "Receive instant notifications for parking issues, blocked driveways, or forgotten headlights.",
          icon: Bell
        },
        {
          title: "2-Way Masked Calls",
          description: "Call and receive calls through our secure virtual relay with 100% number masking.",
          icon: PhoneCall
        }
      ]
    },
    {
      category: "PROTECT",
      description: "Dedicated safety tools and emergency assistance when you need them most.",
      badgeColor: "text-red-400 bg-red-500/10 border-red-500/30",
      items: [
        {
          title: "Lost Mode",
          description: "Help people reach you and share helpful location tips when your vehicle needs assistance or recovery.",
          icon: ShieldCheck
        },
        {
          title: "Emergency Contact",
          description: "Dedicated emergency contact routing so family members can be reached privately in urgent situations.",
          icon: AlertTriangle
        },
        {
          title: "Privacy Controls",
          description: "Choose exactly how and when people can reach you with customizable alert settings.",
          icon: Sliders
        }
      ]
    },
    {
      category: "MANAGE",
      description: "Keep all your vehicles and important records organized in one account.",
      badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      items: [
        {
          title: "Multiple Vehicles",
          description: "Manage all your family cars, motorcycles, and commercial vehicles under one profile.",
          icon: Car
        },
        {
          title: "Document Locker",
          description: "Keep digital copies of your RC, insurance, and emission certificates safely accessible.",
          icon: FileText
        },
        {
          title: "Family Access",
          description: "Share vehicle notifications with family members or drivers using your vehicle.",
          icon: Users
        }
      ]
    }
  ];

  return (
    <main className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      
      {/* Header */}
      <FadeIn className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-3">
          Everything You Need &bull; Nothing Complicated
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white font-heading tracking-tight mb-4">
          Features
        </h1>
        <p className="text-lg text-gray-300 leading-relaxed">
          Smart vehicle privacy and safety organized into three simple categories.
        </p>
      </FadeIn>

      {/* 3 Clear Categories */}
      <div className="space-y-16 mb-20">
        {featureCategories.map((cat, catIdx) => (
          <FadeIn key={cat.category} delay={catIdx * 0.1}>
            <div className="rounded-[2.5rem] bg-white/[0.03] border border-white/10 p-8 sm:p-10">
              
              {/* Category Header */}
              <div className="mb-8">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-mono font-bold border tracking-wider mb-2 ${cat.badgeColor}`}>
                  {cat.category}
                </span>
                <p className="text-sm text-gray-400">{cat.description}</p>
              </div>

              {/* 3 Items per Category */}
              <div className="grid md:grid-cols-3 gap-6">
                {cat.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={item.title}
                      className="bg-black/40 border border-white/5 rounded-2xl p-6 hover:border-white/15 transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white/5 text-cyan-400 flex items-center justify-center mb-4">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{item.description}</p>
                    </div>
                  );
                })}
              </div>

            </div>
          </FadeIn>
        ))}
      </div>

      {/* Bottom CTA */}
      <FadeIn delay={0.3} className="text-center">
        <div className="bg-gradient-to-r from-blue-900/30 via-cyan-900/20 to-black border border-cyan-500/30 rounded-3xl p-8 sm:p-12 max-w-2xl mx-auto shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 font-heading">
            Protect your vehicle today
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Equip your car or motorcycle with a Vyra Smart Tag and enjoy lifetime privacy.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/buy" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 text-white font-extrabold px-8 py-3.5 rounded-full shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:scale-105 transition"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Get Vyra Tag — ₹499</span>
              <span className="text-xs text-gray-300 line-through">₹799</span>
            </Link>
          </div>
        </div>
      </FadeIn>

    </main>
  );
}
