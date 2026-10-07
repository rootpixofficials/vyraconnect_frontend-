"use client";

import { Car, CheckCircle2, Clock, Cpu, FileText, MapPin, MessageSquare, QrCode, Share2, ShoppingCart, Smartphone, Users } from "lucide-react";
import FadeIn from "@/components/FadeIn";

export default function Features() {
  const features = [
    { title: "Private QR contact", desc: "Anyone can scan your Vyra Tag to reach you privately—without seeing your phone number.", icon: QrCode },
    { title: "Scan QR / plate", desc: "One scan: notify an active owner, or activate a new Vyra Tag. Plate lookup works too.", icon: Smartphone },
    { title: "Activate Vyra Tag", desc: "Got a new sticker? Same Scan QR flow opens activation when the tag is not linked yet.", icon: CheckCircle2 },
    { title: "Multi-vehicle garage", desc: "Add and manage multiple vehicles from one account—cars, bikes, and more.", icon: Car },
    { title: "Document locker", desc: "Store RC, insurance, PUC, and other vehicle docs securely in the app.", icon: FileText },
    { title: "Family / temp assign", desc: "Share access with family or temporarily assign a vehicle when someone else is driving.", icon: Users },
    { title: "Lost Mode + tips", desc: "Mark a vehicle lost, collect community tips, and get location when someone notifies you.", icon: MapPin },
    { title: "Chat / SMS / masked call", desc: "Talk through masked chat, SMS templates, and routed voice—numbers stay private.", icon: MessageSquare },
    { title: "Live Status + privacy", desc: "Set Available, Busy, Driving, or Do Not Disturb. Control which channels reach you.", icon: Clock },
    { title: "Vyra AI toolkit", desc: "Get AI-assisted help for vehicle questions, reminders, and day-to-day ownership tasks.", icon: Cpu },
    { title: "Order QR tags", desc: "Buy official Vyra Tag QR stickers online and track your order to delivery.", icon: ShoppingCart },
    { title: "Refer & Earn", desc: "Invite friends from the app and earn rewards when they join Vyra Connect.", icon: Share2 },
  ];

  return (
    <main className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      <FadeIn className="text-center mb-16">
        <h1 className="text-4xl font-bold text-white mb-4 font-heading">Features</h1>
        <p className="text-xl text-gray-400">Everything in the Vyra Connect app & web</p>
      </FadeIn>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <FadeIn key={i} delay={i * 0.05} direction="up">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition hover:border-blue-500/30 shadow-lg h-full">
              <feature.icon className="w-10 h-10 text-blue-500 mb-6" />
              <h3 className="text-xl font-bold text-white mb-3 font-heading">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">{feature.desc}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </main>
  );
}
