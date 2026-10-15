"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ShieldCheck, CheckCircle2, Truck, Sparkles, QrCode, 
  PhoneOff, Lock, RefreshCw, Star, MessageSquare, 
  ShoppingCart, ArrowRight, Car, Award, ChevronDown, Check,
  ExternalLink, Zap, Box, Tag, CreditCard
} from "lucide-react";
import FadeIn from "@/components/FadeIn";

const PACKS = [
  {
    id: "solo",
    name: "Solo Edition",
    tags: 1,
    tagline: "Ideal for your personal car or bike",
    price: 399,
    originalPrice: 799,
    discount: "50% OFF",
    popular: false,
    badge: "Essential"
  },
  {
    id: "duo",
    name: "Duo Pack",
    tags: 2,
    tagline: "Most popular for couples & 2 vehicles",
    price: 699,
    originalPrice: 1599,
    discount: "56% OFF",
    popular: true,
    badge: "Most Popular"
  },
  {
    id: "squad",
    name: "Family Fleet",
    tags: 4,
    tagline: "Complete protection for family or garage",
    price: 1299,
    originalPrice: 3199,
    discount: "60% OFF",
    popular: false,
    badge: "Best Value"
  }
];

const FINISHES = [
  {
    id: "stealth",
    name: "Obsidian Stealth",
    desc: "Ultra-matte black with cyber cyan illuminated accent",
    color: "from-zinc-900 to-black",
    border: "border-cyan-500/50",
    glow: "rgba(6, 182, 212, 0.3)"
  },
  {
    id: "chrome",
    name: "Cyber Chrome",
    desc: "Liquid metal reflective chrome with electric blue core",
    color: "from-slate-700 to-zinc-900",
    border: "border-blue-400/50",
    glow: "rgba(59, 130, 246, 0.3)"
  },
  {
    id: "carbon",
    name: "Forged Carbon",
    desc: "Aerospace composite weave with diamond armor coat",
    color: "from-stone-900 to-black",
    border: "border-emerald-400/50",
    glow: "rgba(16, 185, 129, 0.3)"
  }
];

const FAQS = [
  {
    q: "How does the Vyra Smart Tag protect my privacy?",
    a: "When your vehicle is parked and someone needs to contact you (e.g. blocking a driveway or parking issue), they simply point any smartphone camera at your tag. They are taken to a secure Vyra interface where they can send you a masked message, alert, or masked call. Your personal mobile number is 100% hidden at all times."
  },
  {
    q: "How easy is it to set up once it arrives?",
    a: "Setup takes under 60 seconds! Just peel the ultra-durable 3M backing, stick the tag to the inside of your windshield or window, scan it once with your phone, and link your vehicle registration number. No complex installation or wiring required."
  },
  {
    q: "Are there any monthly subscription fees?",
    a: "None whatsoever! Your one-time purchase includes lifetime access to the Vyra Connect platform, encrypted communication channels, instant emergency notification routing, and cloud garage."
  },
  {
    q: "Is the tag weather and car-wash proof?",
    a: "Yes! Vyra Tags are constructed with aerospace-grade polycarbonate and UV-resistant polymers. They withstand extreme heat, rain, pressure car washes, and harsh sunlight with a 10-year durability rating."
  },
  {
    q: "How long does delivery take?",
    a: "All orders are dispatched within 24 hours from Calicut, Kerala via Express Delivery. You will receive tracking updates directly on WhatsApp and typical delivery takes 2 to 4 business days anywhere in India."
  }
];

const SHOWCASE_VIEWS = {
  kit: {
    id: "kit",
    label: "Official Kit",
    src: "/images/vyra-kit-showcase.jpg",
    alt: "Vyra Connect Official Kit Box with QR Sticker, Tag and ID Card",
    badge: "Official ₹399 Suite",
    desc: "Includes Bike QR Sticker, Keyring Tag & Vehicle ID Card"
  },
  car: {
    id: "car",
    label: "Hypercar",
    src: "/images/experience-luxury-car.webp",
    alt: "Stealth luxury hypercar with Vyra Connect windshield tag",
    badge: "Automotive Dark Edition",
    desc: "Windshield mount with 0.38s instant privacy QR detection"
  },
  bike: {
    id: "bike",
    label: "Superbike",
    src: "/images/stealth-superbike.webp",
    alt: "Stealth superbike with Vyra Connect fuel tank QR sticker",
    badge: "Superbike Edition",
    desc: "High-grade waterproof tank & fairing placement"
  }
} as const;

export default function BuyPage() {
  const [selectedPack, setSelectedPack] = useState(PACKS[1]); // Duo pack by default
  const [selectedFinish, setSelectedFinish] = useState(FINISHES[0]);
  const [vehicleType, setVehicleType] = useState("car");
  const [plateNumber, setPlateNumber] = useState("KL 11 AZ 7777");
  const [showcaseView, setShowcaseView] = useState<"kit" | "car" | "bike">("kit");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "Kerala",
    pincode: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const generateWhatsAppLink = (orderId?: string) => {
    const id = orderId || `VYRA-${Math.floor(100000 + Math.random() * 900000)}`;
    const msg = `*NEW VYRA CONNECT ORDER (${id})*
-----------------------------
*Pack:* ${selectedPack.name} (${selectedPack.tags} Smart Tag${selectedPack.tags > 1 ? 's' : ''})
*Price:* ₹${selectedPack.price} (Free Shipping)
*Edition:* ${selectedFinish.name}
*Vehicle Type:* ${vehicleType.toUpperCase()}
*Preview Plate:* ${plateNumber || 'Not specified'}

*Customer Details:*
• Name: ${formData.name || 'Not provided yet'}
• Phone: ${formData.phone || 'Not provided yet'}
• Address: ${formData.address || 'Not provided'}
• City/State: ${formData.city ? `${formData.city}, ` : ''}${formData.state} - ${formData.pincode}
• Special Notes: ${formData.notes || 'None'}

Please confirm my order and share delivery details!`;

    return `https://wa.me/917907965255?text=${encodeURIComponent(msg)}`;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      alert("Please enter your Name, Phone Number, and Delivery Address.");
      return;
    }

    setIsSubmitting(true);
    const orderId = `VYRA-${Math.floor(100000 + Math.random() * 900000)}`;

    // Simulate order placement
    setTimeout(() => {
      setIsSubmitting(false);
      setOrderComplete(orderId);
    }, 800);
  };

  return (
    <main className="min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Top Banner / Breadcrumb */}
      <FadeIn className="text-center mb-12">
        <div className="inline-flex items-center gap-2 border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 rounded-full px-5 py-2 text-xs font-semibold tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          Official Vyra Smart Tag Store
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight font-heading mb-4">
          Upgrade Your Vehicle with <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-300 bg-clip-text text-transparent">Vyra Connect</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Ultra-durable, privacy-shielded smart QR tags. Protect your personal number, receive instant parking pings, and access your vehicle doc locker.
        </p>
      </FadeIn>

      {/* Main Grid: Left side visual & customizer, Right side options & order */}
      <div className="grid lg:grid-cols-12 gap-12 items-start mb-20">
        
        {/* Left Column: Visual Tag Showcase & Live Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-8 sticky top-28">
          <FadeIn direction="right">
            {/* Tag Showcase Card */}
            <div className="relative rounded-[2.5rem] bg-gradient-to-b from-white/10 to-black/60 border border-white/10 p-6 md:p-8 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[90px] rounded-full pointer-events-none" />
              
              {/* Showcase Switcher */}
              <div className="flex items-center justify-between mb-4 bg-white/5 p-1 rounded-2xl border border-white/10">
                {(["kit", "car", "bike"] as const).map((view) => (
                  <button
                    key={view}
                    type="button"
                    onClick={() => setShowcaseView(view)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                      showcaseView === view
                        ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/25"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {SHOWCASE_VIEWS[view].label}
                  </button>
                ))}
              </div>

              {/* Dynamic Image Showcase */}
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden mb-4 border border-white/10 shadow-2xl group bg-black/60">
                <Image 
                  key={showcaseView}
                  src={SHOWCASE_VIEWS[showcaseView].src} 
                  alt={SHOWCASE_VIEWS[showcaseView].alt} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700" 
                  priority 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />
                
                {/* Top Badge */}
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md border border-cyan-500/30 text-cyan-400 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  {SHOWCASE_VIEWS[showcaseView].badge}
                </div>

                {/* Overlay live indicator / kit highlight */}
                <div className="absolute bottom-3 left-3 right-3 bg-black/80 backdrop-blur-md border border-white/15 p-3 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0">
                      <QrCode className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-[10px] tracking-wider text-gray-400 uppercase font-mono">
                        {showcaseView === "kit" ? "Included in Package" : "Linked Vehicle"}
                      </div>
                      <div className="text-xs font-bold text-white tracking-wider font-mono">
                        {showcaseView === "kit" ? "Complete ₹399 Hardware Kit" : (plateNumber || "YOUR CAR")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] px-2.5 py-1 rounded-full font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Official
                  </div>
                </div>
              </div>

              {/* 3 Hardware Items Included in the Kit */}
              <div className="bg-black/40 border border-white/5 rounded-2xl p-3.5 mb-4">
                <div className="text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <Box className="w-3.5 h-3.5" /> What You Receive in the Box:
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">3 Items Included</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-2 text-center group hover:border-cyan-500/40 transition-colors">
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-1.5 bg-black/50 border border-white/5">
                      <Image src="/images/product-bike-sticker.jpg" alt="Bike QR Sticker" fill className="object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="text-[11px] font-bold text-white leading-tight">Bike Sticker</div>
                    <div className="text-[9px] text-gray-400 font-mono">30×45mm</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-2 text-center group hover:border-cyan-500/40 transition-colors">
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-1.5 bg-black/50 border border-white/5">
                      <Image src="/images/product-portable-tag.jpg" alt="Keyring Scanner Tag" fill className="object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="text-[11px] font-bold text-white leading-tight">Keyring Tag</div>
                    <div className="text-[9px] text-gray-400 font-mono">Portable Tag</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-2 text-center group hover:border-cyan-500/40 transition-colors">
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-1.5 bg-black/50 border border-white/5">
                      <Image src="/images/product-vehicle-id-card.jpg" alt="Vehicle ID Card" fill className="object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="text-[11px] font-bold text-white leading-tight">Vehicle ID Card</div>
                    <div className="text-[9px] text-gray-400 font-mono">85.6×54mm</div>
                  </div>
                </div>
              </div>

              {/* Live Preview Input */}
              <div className="bg-black/40 border border-white/5 rounded-2xl p-4 mb-4">
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                  Test Your Vehicle Registration Number:
                </label>
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus-within:border-cyan-500 transition-colors">
                  <Car className="w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    value={plateNumber} 
                    onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. KL 11 AZ 7777" 
                    maxLength={16}
                    className="bg-transparent text-white font-mono font-bold tracking-wider outline-none w-full placeholder:text-gray-600"
                  />
                </div>
              </div>

              {/* Guaranteed Specs Pills */}
              <div className="grid grid-cols-2 gap-3 text-xs text-gray-300">
                <div className="flex items-center gap-2 bg-white/5 border border-white/5 p-3 rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>10-Yr UV & Water Shield</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/5 p-3 rounded-xl">
                  <PhoneOff className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>100% Number Masked</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/5 p-3 rounded-xl">
                  <Truck className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Free Express Delivery</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/5 p-3 rounded-xl">
                  <RefreshCw className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Zero Subscriptions</span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Right Column: Pack Selection & Checkout Form (7 cols) */}
        <div className="lg:col-span-7 space-y-10">
          
          {/* STEP 1: Select Pack */}
          <FadeIn direction="left" delay={0.1}>
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 md:p-8 backdrop-blur-md">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Step 1</span>
                  <h2 className="text-2xl font-bold text-white font-heading">Choose Your Pack</h2>
                </div>
                <span className="text-xs text-gray-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                  All packs include Free Shipping
                </span>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                {PACKS.map((pack) => {
                  const isSelected = selectedPack.id === pack.id;
                  return (
                    <div 
                      key={pack.id}
                      onClick={() => setSelectedPack(pack)}
                      className={`relative cursor-pointer rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between ${
                        isSelected 
                          ? "bg-gradient-to-b from-blue-900/40 to-black border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.25)] scale-[1.02]" 
                          : "bg-black/30 border-white/10 hover:border-white/20 hover:bg-white/5"
                      }`}
                    >
                      {pack.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-600 text-black text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                          {pack.badge}
                        </div>
                      )}

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-white text-base">{pack.name}</h3>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                        </div>
                        <p className="text-xs text-gray-400 mb-4">{pack.tagline}</p>
                      </div>

                      <div className="mt-auto pt-3 border-t border-white/10">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-extrabold text-white">₹{pack.price}</span>
                          <span className="text-xs text-gray-500 line-through">₹{pack.originalPrice}</span>
                        </div>
                        <div className="text-[11px] font-semibold text-emerald-400 mt-0.5">{pack.discount}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </FadeIn>

          {/* STEP 2: Finish & Vehicle Type */}
          <FadeIn direction="left" delay={0.2}>
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 md:p-8 backdrop-blur-md">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Step 2</span>
              <h2 className="text-2xl font-bold text-white font-heading mb-6">Select Finish Edition</h2>

              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                {FINISHES.map((finish) => {
                  const isSelected = selectedFinish.id === finish.id;
                  return (
                    <div 
                      key={finish.id}
                      onClick={() => setSelectedFinish(finish)}
                      className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                        isSelected 
                          ? `bg-black/60 ${finish.border} shadow-lg scale-[1.02]` 
                          : "bg-black/30 border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-4 h-4 rounded-full bg-gradient-to-tr ${finish.color} border border-white/30`} />
                        <h4 className="text-sm font-bold text-white">{finish.name}</h4>
                      </div>
                      <p className="text-[11px] text-gray-400 leading-snug">{finish.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* Vehicle Type selection */}
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                  Vehicle Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "car", label: "Car / SUV", icon: Car },
                    { id: "bike", label: "Motorcycle", icon: Zap },
                    { id: "fleet", label: "Commercial", icon: Truck }
                  ].map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVehicleType(v.id)}
                      className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-semibold transition ${
                        vehicleType === v.id
                          ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                          : "bg-black/30 border-white/10 text-gray-400 hover:text-white"
                      }`}
                    >
                      <v.icon className="w-4 h-4" />
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>

          {/* STEP 3: Shipping & Fast Checkout Form */}
          <FadeIn direction="left" delay={0.3}>
            <div className="bg-gradient-to-b from-white/10 to-black/80 border border-white/10 rounded-[2.5rem] p-6 md:p-8 backdrop-blur-xl shadow-2xl relative">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Step 3</span>
              <h2 className="text-2xl font-bold text-white font-heading mb-2">Delivery & Order Confirmation</h2>
              <p className="text-sm text-gray-400 mb-6">Enter your address for express door delivery across India.</p>

              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">Full Name *</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      required
                      placeholder="e.g. Rahul Sharma" 
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-cyan-400 transition" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">WhatsApp / Phone Number *</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleInputChange} 
                      required
                      placeholder="e.g. +91 98765 43210" 
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-cyan-400 transition" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Delivery Address (House / Building / Street) *</label>
                  <textarea 
                    name="address" 
                    rows={2} 
                    value={formData.address} 
                    onChange={handleInputChange} 
                    required
                    placeholder="Enter complete house address" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-cyan-400 transition resize-none" 
                  />
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">City / District</label>
                    <input 
                      type="text" 
                      name="city" 
                      value={formData.city} 
                      onChange={handleInputChange} 
                      placeholder="e.g. Calicut" 
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-cyan-400 transition" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">State</label>
                    <input 
                      type="text" 
                      name="state" 
                      value={formData.state} 
                      onChange={handleInputChange} 
                      placeholder="e.g. Kerala" 
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-cyan-400 transition" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">PIN Code</label>
                    <input 
                      type="text" 
                      name="pincode" 
                      value={formData.pincode} 
                      onChange={handleInputChange} 
                      placeholder="e.g. 673001" 
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-cyan-400 transition" 
                    />
                  </div>
                </div>

                {/* Summary Box */}
                <div className="bg-black/50 border border-white/10 rounded-2xl p-5 my-6 space-y-2.5">
                  <div className="flex justify-between text-sm text-gray-300">
                    <span>{selectedPack.name} ({selectedPack.tags} Smart Tag{selectedPack.tags > 1 ? 's' : ''})</span>
                    <span className="font-semibold text-white">₹{selectedPack.price}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-300">
                    <span>Finish Edition</span>
                    <span className="text-cyan-400 font-medium">{selectedFinish.name}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-300">
                    <span>Express Shipping</span>
                    <span className="text-emerald-400 font-semibold">FREE</span>
                  </div>
                  <div className="border-t border-white/10 pt-3 flex justify-between items-baseline">
                    <span className="text-base font-bold text-white">Total Amount</span>
                    <span className="text-2xl font-extrabold text-white">₹{selectedPack.price}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 text-white font-bold py-4 rounded-full shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-base"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing Order...
                      </span>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        Confirm & Place Order
                      </>
                    )}
                  </button>

                  <a
                    href={generateWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/30 font-bold py-4 rounded-full transition-all flex items-center justify-center gap-2 text-base shadow-lg"
                  >
                    <MessageSquare className="w-5 h-5 text-[#25D366]" />
                    Order via WhatsApp
                  </a>
                </div>
              </form>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      {orderComplete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-[#0a1526] to-black border border-cyan-500/40 rounded-3xl max-w-lg w-full p-8 shadow-[0_0_60px_rgba(6,182,212,0.4)] relative text-center">
            <div className="w-20 h-20 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-400 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(6,182,212,0.5)]">
              <Check className="w-10 h-10 stroke-[3]" />
            </div>

            <h3 className="text-3xl font-extrabold text-white mb-2 font-heading">Order Confirmed!</h3>
            <p className="text-gray-300 text-sm mb-6">
              Thank you for choosing Vyra Connect. Your order has been placed successfully and dispatched from our facility.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left mb-6 space-y-2 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Order ID:</span>
                <span className="text-cyan-400 font-bold">{orderComplete}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Pack:</span>
                <span className="text-white">{selectedPack.name} (₹{selectedPack.price})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Delivery Est.:</span>
                <span className="text-emerald-400">2 - 4 Business Days</span>
              </div>
            </div>

            <div className="space-y-3">
              <a
                href={generateWhatsAppLink(orderComplete)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] text-black font-extrabold py-3.5 rounded-full flex items-center justify-center gap-2 hover:bg-[#20ba5a] transition"
              >
                <MessageSquare className="w-5 h-5" />
                Get Instant WhatsApp Updates
              </a>

              <button
                onClick={() => setOrderComplete(null)}
                className="w-full bg-white/10 text-white font-semibold py-3 rounded-full hover:bg-white/20 transition"
              >
                Back to Store
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WHY CHOOSE VYRA TAG (Features Banner) */}
      <section className="mb-24">
        <FadeIn className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white font-heading mb-4">Why Premium Owners Trust Vyra</h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm">Engineered for luxury supercars, family sedans, and daily commuters alike.</p>
        </FadeIn>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            {
              title: "Zero Number Exposure",
              desc: "Masked proxy calling and SMS relays keep your personal contact confidential.",
              icon: PhoneOff
            },
            {
              title: "60-Second Instant Setup",
              desc: "Point camera, tap activate, and link your vehicle. No technical skills needed.",
              icon: QrCode
            },
            {
              title: "Emergency & Lost Mode",
              desc: "Activate Lost Mode to collect community geolocation tips in real time.",
              icon: ShieldCheck
            },
            {
              title: "All-Weather Armor",
              desc: "Engineered to resist harsh monsoons, direct desert sun, and power car washes.",
              icon: Award
            }
          ].map((item, idx) => (
            <FadeIn key={idx} delay={idx * 0.1}>
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors h-full">
                <item.icon className="w-8 h-8 text-cyan-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-4xl mx-auto">
        <FadeIn className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white font-heading mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-400 text-sm">Got questions about purchasing or using Vyra Tag? We've got answers.</p>
        </FadeIn>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div 
              key={idx}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-semibold text-white text-base">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-cyan-400 transition-transform ${openFaq === idx ? "rotate-180" : ""}`} />
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-6 text-sm text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
