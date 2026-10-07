"use client";

import { Send } from "lucide-react";

export default function ContactForm() {
  return (
    <form className="space-y-5 text-left w-full" onSubmit={(e) => e.preventDefault()}>
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1.5">Your Name</label>
          <input 
            type="text" 
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" 
            placeholder="John Doe" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1.5">Email Address</label>
          <input 
            type="email" 
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" 
            placeholder="john@example.com" 
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1.5">Subject</label>
        <input 
          type="text" 
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" 
          placeholder="How can we help?" 
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1.5">Message</label>
        <textarea 
          rows={4} 
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition resize-none" 
          placeholder="Write your message here..."
        ></textarea>
      </div>
      <button 
        type="submit" 
        className="w-full bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)]"
      >
        <Send className="w-4 h-4" /> Send Message
      </button>
    </form>
  );
}
