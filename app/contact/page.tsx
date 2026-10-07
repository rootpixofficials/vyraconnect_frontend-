"use client";

import { HelpCircle, Mail, MapPin, Phone } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import FadeIn from "@/components/FadeIn";

export default function Contact() {
  const faqs = [
    { q: "How do I activate a Vyra Tag?", a: "Use Scan QR on this site (or the app). Scan your new sticker—if it is not activated yet, we open the activation form. Link it to your vehicle and you’re ready for private scan-to-contact." },
    { q: "Can scanners see my phone number?", a: "No. Scanners contact you through Vyra Connect’s private channels—notify, chat, SMS, or masked call—without your personal number being shown." },
    { q: "How do I contact an owner from the website?", a: "Use Scan QR: enter a plate or scan a QR. Active tags open notify; new tags open activation—all from the same scan." },
    { q: "What is Lost Mode?", a: "Lost Mode marks a vehicle as missing in the app. When someone notifies you, you can receive tips and location to help recover it faster." },
    { q: "How do orders / Buy Now work?", a: "Tap Buy Now to order official Vyra Tag QR stickers. After delivery, activate the tag on web or in the app and start using it." },
    { q: "How do I get support?", a: "Message us on WhatsApp from the Contact section, reach support in the app, or email support@vyraconnect.com." },
  ];

  return (
    <main className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      <div className="grid lg:grid-cols-2 gap-16">
        <FadeIn className="col-span-1 lg:col-span-2">
          <h1 className="text-4xl font-bold text-white mb-4 font-heading">Contact Us</h1>
          <p className="text-gray-400 mb-8 text-lg">Have questions? We are here to help you protect your vehicles.</p>
          
          {/* Big Map */}
          <div className="w-full h-[450px] mb-8 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl relative bg-black/50">
            <iframe 
              src="https://maps.google.com/maps?q=Calicut,%20Kerala,%20India&t=&z=13&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) brightness(80%) contrast(120%)" }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </FadeIn>
        
        <FadeIn delay={0.2} direction="right">
          <h2 className="text-3xl font-bold text-white mb-8 font-heading">Get in Touch</h2>
          <div className="space-y-6 mb-12">
            <div className="flex items-center gap-5 bg-white/5 p-6 rounded-2xl border border-white/10">
              <div className="w-14 h-14 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-500 shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Address</h3>
                <p className="text-gray-400">Calicut, Kerala, India</p>
              </div>
            </div>
            <div className="flex items-center gap-5 bg-white/5 p-6 rounded-2xl border border-white/10">
              <div className="w-14 h-14 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-500 shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Phone</h3>
                <p className="text-gray-400">+91 7907965255</p>
              </div>
            </div>
            <div className="flex items-center gap-5 bg-white/5 p-6 rounded-2xl border border-white/10">
              <div className="w-14 h-14 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-500 shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Email</h3>
                <p className="text-gray-400">support@vyraconnect.com</p>
              </div>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-6 font-heading">Send us a Message</h3>
          <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-lg">
            <ContactForm />
          </div>
        </FadeIn>

        <div>
          <FadeIn delay={0.2} direction="left">
            <h2 className="text-3xl font-bold text-white mb-8 font-heading">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg hover:border-blue-500/30 transition-colors">
                  <h3 className="flex items-start gap-3 text-lg font-bold text-white mb-3">
                    <HelpCircle className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" /> {faq.q}
                  </h3>
                  <p className="text-gray-400 pl-9 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </main>
  );
}
