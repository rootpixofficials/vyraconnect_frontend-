"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

interface ContactFormProps {
  origin?: string;
}

export default function ContactForm({ origin = "Website Contact Form" }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage("Please fill in your name, email address, and message.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          origin
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsSuccess(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: ""
        });
      } else {
        setErrorMessage(data.error || "Failed to send message. Please try again or reach out on WhatsApp.");
      }
    } catch (err: any) {
      console.error("Contact submit error:", err);
      setErrorMessage("Network error sending message. You can also contact us directly at vyraconnect.in@gmail.com or on WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4 text-left w-full" onSubmit={handleSubmit}>
      
      {/* Success Banner */}
      {isSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 flex items-start gap-3 shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <strong className="block font-bold text-white mb-0.5">Message Sent Successfully!</strong>
            Your inquiry has been delivered directly to our support desk at <span className="text-emerald-300 font-mono font-bold">vyraconnect.in@gmail.com</span>. We will review your message and reply as soon as possible.
          </div>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 flex items-start gap-3 shadow-lg">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">{errorMessage}</div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">Your Name *</label>
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition" 
            placeholder="John Doe" 
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">Email Address *</label>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition" 
            placeholder="john@example.com" 
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">Phone / WhatsApp (Optional)</label>
          <input 
            type="tel" 
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition" 
            placeholder="+91 98765 43210" 
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">Subject</label>
          <input 
            type="text" 
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition" 
            placeholder="Order inquiry, Bulk fleet tags, Support..." 
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-300 mb-1.5">Message *</label>
        <textarea 
          rows={4} 
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition resize-none" 
          placeholder="Write your questions or notes here..."
        ></textarea>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 text-white px-8 py-3.5 rounded-xl font-bold hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 text-sm"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Sending Message...
          </span>
        ) : (
          <>
            <Send className="w-4 h-4" /> Send Message
          </>
        )}
      </button>
    </form>
  );
}
