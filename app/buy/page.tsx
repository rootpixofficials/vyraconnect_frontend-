"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ShieldCheck, Check, Truck, ShoppingCart, 
  ArrowRight, CheckCircle2, MessageSquare, Plus, Minus
} from "lucide-react";
import FadeIn from "@/components/FadeIn";

const PACK_OPTIONS = [
  {
    id: "solo",
    name: "Solo Kit (1 Vehicle)",
    tags: 1,
    price: 499,
    originalPrice: 799,
    savings: "Save ₹300",
    badge: "Most Popular"
  },
  {
    id: "duo",
    name: "Duo Pack (2 Vehicles)",
    tags: 2,
    price: 899,
    originalPrice: 1599,
    savings: "Save ₹700",
    badge: "Great for Couples"
  },
  {
    id: "family",
    name: "Family Fleet (4 Vehicles)",
    tags: 4,
    price: 1499,
    originalPrice: 3199,
    savings: "Save ₹1,700",
    badge: "Best Value"
  }
];

export default function BuyPage() {
  const [selectedPackId, setSelectedPackId] = useState("solo");
  const [quantity, setQuantity] = useState(1);
  const [plateNumber, setPlateNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "Kerala",
    pincode: "",
    notes: ""
  });

  const selectedPack = PACK_OPTIONS.find(p => p.id === selectedPackId) || PACK_OPTIONS[0];
  const totalPrice = selectedPack.price * quantity;
  const totalTags = selectedPack.tags * quantity;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      alert("Please fill in your Full Name, Phone Number, and Delivery Address.");
      return;
    }

    setIsSubmitting(true);
    const orderId = `VYRA-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          notes: formData.notes,
          packName: selectedPack.name,
          tagsCount: totalTags,
          quantity,
          plateNumber: plateNumber || "Not specified",
          totalPrice,
          price: totalPrice
        })
      });

      const data = await res.json().catch(() => ({}));
      setOrderComplete(data?.orderId || orderId);
    } catch (err) {
      console.error("Order submit network error:", err);
      setOrderComplete(orderId);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateWhatsAppLink = () => {
    const msg = `Hi Vyra Connect, I would like to place an order:
Order ID: ${orderComplete || 'New Order'}
Pack: ${selectedPack.name} (Qty: ${quantity})
Total: ₹${totalPrice}
Name: ${formData.name}
Phone: ${formData.phone}
Address: ${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}
Vehicle Plate: ${plateNumber || 'To be activated later'}

Please confirm my order and share delivery details!`;

    return `https://wa.me/919746910890?text=${encodeURIComponent(msg)}`;
  };

  return (
    <main className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto overflow-hidden">
      
      {/* Top Title */}
      <FadeIn className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl sm:text-5xl font-black text-white font-heading tracking-tight mb-3">
          Get Your Vyra Tag
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Complete smart vehicle privacy kit. No monthly subscriptions, free express delivery across India.
        </p>
      </FadeIn>

      {/* Main Order Grid */}
      <div className="grid lg:grid-cols-12 gap-10 items-start mb-20">
        
        {/* Left Column: Product Showcase & Details (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <FadeIn direction="right">
            
            {/* Real Product Card Mockup */}
            <div className="rounded-3xl bg-gradient-to-b from-white/10 to-black/60 border border-white/15 p-6 backdrop-blur-xl shadow-2xl">
              <div className="relative w-full aspect-[1024/646] rounded-2xl overflow-hidden mb-5 shadow-lg">
                <Image 
                  src="/images/vyra-tag-card.webp" 
                  alt="Vyra Smart Tag Kit" 
                  fill 
                  className="object-contain" 
                  priority 
                />
              </div>

              <div>
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  Official Hardware Kit
                </span>
                <h2 className="text-2xl font-bold text-white font-heading mt-1">
                  Vyra Smart Tag Kit
                </h2>
              </div>

              {/* Price Banner */}
              <div className="flex items-baseline gap-3 my-4">
                <span className="text-3xl sm:text-4xl font-black text-white">₹{selectedPack.price}</span>
                <span className="text-base text-gray-500 line-through">₹{selectedPack.originalPrice}</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  {selectedPack.savings}
                </span>
              </div>

              {/* Included in Kit */}
              <div className="space-y-2.5 text-xs sm:text-sm text-gray-300 pt-3 border-t border-white/10">
                <p className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">
                  What&apos;s Included:
                </p>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Weatherproof QR Smart Sticker</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Keyring Scanner Tag</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Vehicle ID Card</span>
                </div>
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Lifetime Access &bull; No monthly subscription</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Truck className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Dispatched within 24h from Vettichira, Kerala</span>
                </div>
              </div>

            </div>
          </FadeIn>
        </div>

        {/* Right Column: Checkout Form & Quantity (7 cols) */}
        <div className="lg:col-span-7">
          <FadeIn direction="left">
            <div className="rounded-3xl bg-black/60 border border-white/15 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
              
              <h2 className="text-xl sm:text-2xl font-bold text-white font-heading mb-1">
                Order Details
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mb-6">
                Enter your delivery address for express door delivery anywhere in India.
              </p>

              <form onSubmit={handlePlaceOrder} className="space-y-4">
                
                {/* Pack Selection */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2">
                    Select Pack:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {PACK_OPTIONS.map((pack) => (
                      <button
                        key={pack.id}
                        type="button"
                        onClick={() => setSelectedPackId(pack.id)}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          selectedPackId === pack.id
                            ? "bg-cyan-500/10 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                            : "bg-white/[0.03] border-white/10 text-gray-400 hover:border-white/20"
                        }`}
                      >
                        <div className="text-xs font-bold text-white leading-tight">{pack.name}</div>
                        <div className="text-sm font-black text-cyan-300 mt-1">₹{pack.price}</div>
                        <div className="text-[10px] text-gray-400 line-through">₹{pack.originalPrice}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center justify-between bg-white/[0.03] border border-white/10 rounded-2xl p-3.5">
                  <span className="text-xs font-semibold text-gray-300">Quantity</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono font-bold text-base text-white px-2">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Delivery Information Inputs */}
                <div className="grid sm:grid-cols-2 gap-3.5 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Full Name *</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      required
                      placeholder="e.g. Rahul Sharma" 
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-cyan-400 transition" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">WhatsApp / Phone *</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleInputChange} 
                      required
                      placeholder="+91 98765 43210" 
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-cyan-400 transition" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Delivery Address *</label>
                  <textarea 
                    name="address" 
                    rows={2} 
                    value={formData.address} 
                    onChange={handleInputChange} 
                    required
                    placeholder="House / Flat / Street address" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none focus:border-cyan-400 transition resize-none" 
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">City / District</label>
                    <input 
                      type="text" 
                      name="city" 
                      value={formData.city} 
                      onChange={handleInputChange} 
                      placeholder="e.g. Calicut" 
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-cyan-400 transition" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">State</label>
                    <input 
                      type="text" 
                      name="state" 
                      value={formData.state} 
                      onChange={handleInputChange} 
                      placeholder="Kerala" 
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-cyan-400 transition" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">PIN Code</label>
                    <input 
                      type="text" 
                      name="pincode" 
                      value={formData.pincode} 
                      onChange={handleInputChange} 
                      placeholder="e.g. 676552" 
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-cyan-400 transition" 
                    />
                  </div>
                </div>

                {/* Optional Vehicle Plate */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Vehicle Plate Number <span className="text-gray-500 font-normal">(Optional — can be linked later)</span>
                  </label>
                  <input 
                    type="text" 
                    value={plateNumber} 
                    onChange={(e) => setPlateNumber(e.target.value.toUpperCase())} 
                    placeholder="e.g. KL 55 BH 1234" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm uppercase font-mono outline-none focus:border-cyan-400 transition" 
                  />
                </div>

                {/* Total Summary */}
                <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 my-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-400 block">Total Amount ({totalTags} Tag{totalTags > 1 ? 's' : ''})</span>
                    <span className="text-xs text-emerald-400 font-medium">Free Express Delivery</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-white">₹{totalPrice}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 text-white font-extrabold py-4 px-6 rounded-2xl shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-base disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing Order...
                    </span>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      <span>Confirm Order — ₹{totalPrice}</span>
                    </>
                  )}
                </button>

              </form>

            </div>
          </FadeIn>
        </div>

      </div>

      {/* Success Modal */}
      {orderComplete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#091120] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold text-white font-heading">
              Order Received!
            </h3>

            <p className="text-xs font-mono text-cyan-300">
              Order Reference: {orderComplete}
            </p>

            <p className="text-sm text-gray-300 leading-relaxed">
              Thank you for ordering your Vyra Smart Tag! We will process and dispatch your package from Vettichira, Kerala.
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href={generateWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm transition"
              >
                <MessageSquare className="w-4 h-4" />
                Confirm on WhatsApp (+91 97469 10890)
              </a>

              <button
                type="button"
                onClick={() => setOrderComplete(null)}
                className="w-full bg-white/10 hover:bg-white/15 text-white font-semibold py-2.5 rounded-xl text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
