import Link from "next/link";
import { AlertTriangle, Home } from "lucide-react";
import FadeIn from "@/components/FadeIn";

export default function NotFound() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center py-32 px-4 text-center overflow-hidden">
      <FadeIn className="bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-[3rem] shadow-2xl max-w-2xl w-full relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full -z-10" />

        <div className="w-24 h-24 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-8 border border-blue-500/20 shadow-[0_0_30px_rgba(37,99,235,0.2)]">
          <AlertTriangle className="w-12 h-12" />
        </div>
        
        <h1 className="text-7xl font-bold text-white mb-4 tracking-widest font-heading">404</h1>
        <h2 className="text-3xl text-gray-200 mb-6 font-heading">PAGE NOT FOUND</h2>
        
        <p className="text-gray-400 mb-10 max-w-md mx-auto text-lg">
          The scanner seems to have missed this one. The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
        </p>
        
        <Link href="/" className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/30">
          <Home className="w-5 h-5" />
          Return to Garage
        </Link>
      </FadeIn>
    </main>
  );
}
